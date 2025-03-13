import { eq, ilike, and } from 'drizzle-orm';
import { db } from '../db/client';
import { teams, members } from '../db/schema';
import { CreateTeamDto, TeamDto, TeamFiltersDto, UpdateTeamDto } from '../dtos/TeamDto';
import { MemberDto } from '../dtos/MemberDto';
import logger from '../utils/logger';

class TeamRepository {
  /**
   * Cria uma nova equipe
   * @param data Dados da equipe a ser criada
   * @returns A equipe criada
   */
  async create(data: CreateTeamDto): Promise<TeamDto> {
    logger.info(`TeamRepository: Creating team with data: ${JSON.stringify(data)}`);
    
    try {
      const [team] = await db.insert(teams).values({
        name: data.name,
        teamType: data.teamType,
      }).returning();
      
      logger.info(`TeamRepository: Team created with ID: ${team.id}`);
      return this.mapToDto(team);
    } catch (error: any) {
      logger.error(`TeamRepository: Error creating team: ${error.message}`);
      throw error;
    }
  }

  /**
   * Busca uma equipe pelo ID
   * @param id ID da equipe
   * @param includeMembers Se deve incluir os membros da equipe
   * @returns A equipe encontrada ou null
   */
  async findById(id: string, includeMembers: boolean = false): Promise<TeamDto | null> {
    logger.info(`TeamRepository: Finding team with ID: ${id}, includeMembers: ${includeMembers}`);
    
    try {
      const team = await db.query.teams.findFirst({
        where: eq(teams.id, id),
      });

      if (!team) {
        logger.warn(`TeamRepository: Team not found with ID: ${id}`);
        return null;
      }

      const teamDto = this.mapToDto(team);
      logger.info(`TeamRepository: Team found with ID: ${id}`);

      if (includeMembers) {
        logger.info(`TeamRepository: Including members for team with ID: ${id}`);
        const teamMembers = await db.query.members.findMany({
          where: eq(members.teamId, id),
        });

        teamDto.members = teamMembers.map(member => ({
          id: member.id,
          name: member.name,
          email: member.email,
          phone: member.phone,
          isLeader: member.isLeader,
          teamId: member.teamId,
          joinedAt: member.joinedAt,
          active: member.active,
          createdAt: member.createdAt,
          updatedAt: member.updatedAt,
        }));
        
        logger.info(`TeamRepository: Found ${teamDto.members.length} members for team with ID: ${id}`);
      }

      return teamDto;
    } catch (error: any) {
      logger.error(`TeamRepository: Error finding team with ID ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Busca todas as equipes com filtros opcionais
   * @param filters Filtros para a busca
   * @returns Lista de equipes
   */
  async findAll(filters: TeamFiltersDto): Promise<TeamDto[]> {
    logger.info(`TeamRepository: Finding all teams with filters: ${JSON.stringify(filters)}`);
    
    try {
      const conditions = [];

      if (filters.name) {
        logger.info(`TeamRepository: Filtering by name: ${filters.name}`);
        conditions.push(ilike(teams.name, `%${filters.name}%`));
      }

      if (filters.teamType) {
        logger.info(`TeamRepository: Filtering by team type: ${filters.teamType}`);
        conditions.push(eq(teams.teamType, filters.teamType));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const teamsList = await db.query.teams.findMany({
        where: whereClause,
      });

      logger.info(`TeamRepository: Found ${teamsList.length} teams`);
      const teamsDto = teamsList.map(team => this.mapToDto(team));

      if (filters.includeMembers) {
        logger.info(`TeamRepository: Including members for all teams`);
        for (const teamDto of teamsDto) {
          const teamMembers = await db.query.members.findMany({
            where: eq(members.teamId, teamDto.id),
          });

          teamDto.members = teamMembers.map(member => ({
            id: member.id,
            name: member.name,
            email: member.email,
            phone: member.phone,
            isLeader: member.isLeader,
            teamId: member.teamId,
            joinedAt: member.joinedAt,
            active: member.active,
            createdAt: member.createdAt,
            updatedAt: member.updatedAt,
          }));
          
          logger.info(`TeamRepository: Found ${teamDto.members?.length || 0} members for team ${teamDto.id}`);
        }
      }

      return teamsDto;
    } catch (error: any) {
      logger.error(`TeamRepository: Error finding teams: ${error.message}`);
      throw error;
    }
  }

  /**
   * Atualiza uma equipe
   * @param id ID da equipe
   * @param data Dados para atualização
   * @returns A equipe atualizada ou null se não encontrada
   */
  async update(id: string, data: UpdateTeamDto): Promise<TeamDto | null> {
    logger.info(`TeamRepository: Updating team with ID: ${id}, data: ${JSON.stringify(data)}`);
    
    try {
      const existingTeam = await db.query.teams.findFirst({
        where: eq(teams.id, id),
      });

      if (!existingTeam) {
        logger.warn(`TeamRepository: Team not found with ID: ${id}`);
        return null;
      }

      const [updatedTeam] = await db.update(teams)
        .set({
          name: data.name !== undefined ? data.name : existingTeam.name,
          teamType: data.teamType !== undefined ? data.teamType : existingTeam.teamType,
          updatedAt: new Date(),
        })
        .where(eq(teams.id, id))
        .returning();

      logger.info(`TeamRepository: Team updated with ID: ${id}`);
      return this.mapToDto(updatedTeam);
    } catch (error: any) {
      logger.error(`TeamRepository: Error updating team with ID ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Exclui uma equipe
   * @param id ID da equipe
   * @returns true se excluída com sucesso, false se não encontrada
   */
  async delete(id: string): Promise<boolean> {
    logger.info(`TeamRepository: Deleting team with ID: ${id}`);
    
    try {
      const result = await db.delete(teams).where(eq(teams.id, id));
      const deleted = result.rowCount !== null && result.rowCount > 0;
      
      if (deleted) {
        logger.info(`TeamRepository: Team deleted with ID: ${id}`);
      } else {
        logger.warn(`TeamRepository: No team found to delete with ID: ${id}`);
      }
      
      return deleted;
    } catch (error: any) {
      logger.error(`TeamRepository: Error deleting team with ID ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verifica se uma equipe tem pelo menos um líder
   * @param id ID da equipe
   * @returns true se a equipe tem pelo menos um líder, false caso contrário
   */
  async hasLeader(id: string): Promise<boolean> {
    logger.info(`TeamRepository: Checking if team with ID: ${id} has a leader`);
    
    try {
      const leader = await db.query.members.findFirst({
        where: and(
          eq(members.teamId, id),
          eq(members.isLeader, true),
          eq(members.active, true)
        ),
      });

      const hasLeader = !!leader;
      logger.info(`TeamRepository: Team with ID: ${id} ${hasLeader ? 'has' : 'does not have'} a leader`);
      return hasLeader;
    } catch (error: any) {
      logger.error(`TeamRepository: Error checking if team with ID ${id} has a leader: ${error.message}`);
      throw error;
    }
  }

  /**
   * Busca os membros de uma equipe
   * @param teamId ID da equipe
   * @param onlyActive Se deve buscar apenas membros ativos
   * @returns Lista de membros da equipe
   */
  async findMembers(teamId: string, onlyActive: boolean = false): Promise<MemberDto[]> {
    logger.info(`TeamRepository: Finding members of team with ID: ${teamId}, onlyActive: ${onlyActive}`);
    
    try {
      const conditions = [eq(members.teamId, teamId)];

      if (onlyActive) {
        conditions.push(eq(members.active, true));
      }

      const teamMembers = await db.query.members.findMany({
        where: and(...conditions),
      });

      logger.info(`TeamRepository: Found ${teamMembers.length} members for team with ID: ${teamId}`);
      
      return teamMembers.map(member => ({
        id: member.id,
        name: member.name,
        email: member.email,
        phone: member.phone,
        isLeader: member.isLeader,
        teamId: member.teamId,
        joinedAt: member.joinedAt,
        active: member.active,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
      }));
    } catch (error: any) {
      logger.error(`TeamRepository: Error finding members of team with ID ${teamId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Mapeia um registro da tabela para um DTO
   * @param team Registro da tabela
   * @returns DTO da equipe
   */
  private mapToDto(team: typeof teams.$inferSelect): TeamDto {
    return {
      id: team.id,
      name: team.name,
      teamType: team.teamType,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
    };
  }
}

export const teamRepository = new TeamRepository();
