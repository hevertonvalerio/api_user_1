import { CreateTeamDto, TeamDto, TeamFiltersDto, UpdateTeamDto } from '../dtos/TeamDto';
import { MemberDto } from '../dtos/MemberDto';
import { teamRepository } from '../repositories/TeamRepository';
import { memberRepository } from '../repositories/MemberRepository';
import logger from '../utils/logger';

class TeamService {
  /**
   * Cria uma nova equipe
   * @param data Dados da equipe a ser criada
   * @returns A equipe criada
   */
  async create(data: CreateTeamDto): Promise<TeamDto> {
    logger.info(`TeamService: Creating team with data: ${JSON.stringify(data)}`);
    const team = await teamRepository.create(data);
    logger.info(`TeamService: Team created with ID: ${team.id}`);
    return team;
  }

  /**
   * Busca uma equipe pelo ID
   * @param id ID da equipe
   * @param includeMembers Se deve incluir os membros da equipe
   * @returns A equipe encontrada ou null
   */
  async findById(id: string, includeMembers: boolean = false): Promise<TeamDto | null> {
    logger.info(`TeamService: Finding team with ID: ${id}, includeMembers: ${includeMembers}`);
    const team = await teamRepository.findById(id, includeMembers);
    if (team) {
      logger.info(`TeamService: Team found with ID: ${id}`);
    } else {
      logger.warn(`TeamService: Team not found with ID: ${id}`);
    }
    return team;
  }

  /**
   * Busca todas as equipes com filtros opcionais
   * @param filters Filtros para a busca
   * @returns Lista de equipes
   */
  async findAll(filters: TeamFiltersDto): Promise<TeamDto[]> {
    logger.info(`TeamService: Finding all teams with filters: ${JSON.stringify(filters)}`);
    const teams = await teamRepository.findAll(filters);
    logger.info(`TeamService: Found ${teams.length} teams`);
    return teams;
  }

  /**
   * Atualiza uma equipe
   * @param id ID da equipe
   * @param data Dados para atualização
   * @returns A equipe atualizada ou null se não encontrada
   */
  async update(id: string, data: UpdateTeamDto): Promise<TeamDto | null> {
    logger.info(`TeamService: Updating team with ID: ${id}, data: ${JSON.stringify(data)}`);
    
    // Verificar se a equipe existe
    const existingTeam = await teamRepository.findById(id);
    if (!existingTeam) {
      logger.warn(`TeamService: Team not found with ID: ${id}`);
      return null;
    }

    const updatedTeam = await teamRepository.update(id, data);
    logger.info(`TeamService: Team updated with ID: ${id}`);
    return updatedTeam;
  }

  /**
   * Exclui uma equipe
   * @param id ID da equipe
   * @returns true se excluída com sucesso, false se não encontrada
   */
  async delete(id: string): Promise<boolean> {
    logger.info(`TeamService: Deleting team with ID: ${id}`);
    
    // Verificar se a equipe existe
    const existingTeam = await teamRepository.findById(id);
    if (!existingTeam) {
      logger.warn(`TeamService: Team not found with ID: ${id}`);
      return false;
    }

    const result = await teamRepository.delete(id);
    if (result) {
      logger.info(`TeamService: Team deleted with ID: ${id}`);
    } else {
      logger.warn(`TeamService: Failed to delete team with ID: ${id}`);
    }
    return result;
  }

  /**
   * Busca os membros de uma equipe
   * @param teamId ID da equipe
   * @param onlyActive Se deve buscar apenas membros ativos
   * @returns Lista de membros da equipe
   */
  async findMembers(teamId: string, onlyActive: boolean = false): Promise<MemberDto[]> {
    logger.info(`TeamService: Finding members of team with ID: ${teamId}, onlyActive: ${onlyActive}`);
    
    // Verificar se a equipe existe
    const existingTeam = await teamRepository.findById(teamId);
    if (!existingTeam) {
      logger.warn(`TeamService: Team not found with ID: ${teamId}`);
      throw new Error('Team not found');
    }

    const members = await teamRepository.findMembers(teamId, onlyActive);
    logger.info(`TeamService: Found ${members.length} members for team with ID: ${teamId}`);
    return members;
  }

  /**
   * Define um membro como líder da equipe
   * @param teamId ID da equipe
   * @param memberId ID do membro
   * @returns true se definido com sucesso, false se não encontrado
   */
  async setLeader(teamId: string, memberId: string): Promise<boolean> {
    logger.info(`TeamService: Setting member ${memberId} as leader of team ${teamId}`);
    
    // Verificar se a equipe existe
    const existingTeam = await teamRepository.findById(teamId);
    if (!existingTeam) {
      logger.warn(`TeamService: Team not found with ID: ${teamId}`);
      throw new Error('Team not found');
    }

    // Verificar se o membro existe e pertence à equipe
    const member = await memberRepository.findById(memberId);
    if (!member) {
      logger.warn(`TeamService: Member not found with ID: ${memberId}`);
      throw new Error('Member not found');
    }

    if (member.teamId !== teamId) {
      logger.warn(`TeamService: Member ${memberId} does not belong to team ${teamId}`);
      throw new Error('Member does not belong to this team');
    }

    // Verificar se já existe outro líder na equipe
    const existingLeader = await memberRepository.findAll({
      teamId,
      isLeader: true,
      active: true,
    });

    if (existingLeader.length > 0 && !existingLeader.some(leader => leader.id === memberId)) {
      logger.warn(`TeamService: Team ${teamId} already has a leader`);
      throw new Error('Team already has a leader');
    }

    // Atualizar o membro para ser líder
    const updatedMember = await memberRepository.update(memberId, {
      isLeader: true,
    });

    if (updatedMember) {
      logger.info(`TeamService: Member ${memberId} set as leader of team ${teamId}`);
    } else {
      logger.warn(`TeamService: Failed to set member ${memberId} as leader of team ${teamId}`);
    }

    return !!updatedMember;
  }
}

export const teamService = new TeamService();
