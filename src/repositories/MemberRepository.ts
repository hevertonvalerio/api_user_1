import { eq, ilike, and, or } from 'drizzle-orm';
import { db } from '../db/client';
import { members, teams } from '../db/schema';
import { CreateMemberDto, MemberDto, MemberFiltersDto, UpdateMemberDto, UpdateMemberStatusDto } from '../dtos/MemberDto';
import { TeamDto } from '../dtos/TeamDto';
import { teamRepository } from './TeamRepository';

class MemberRepository {
  /**
   * Cria um novo membro
   * @param data Dados do membro a ser criado
   * @returns O membro criado
   */
  async create(data: CreateMemberDto): Promise<MemberDto> {
    // Verificar se o email já está em uso
    const existingMember = await db.query.members.findFirst({
      where: eq(members.email, data.email),
    });

    if (existingMember) {
      throw new Error('Email already in use');
    }

    // Verificar se a equipe existe
    const team = await teamRepository.findById(data.teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    // Se o membro for líder, verificar se já existe outro líder na equipe
    if (data.isLeader) {
      const existingLeader = await db.query.members.findFirst({
        where: and(
          eq(members.teamId, data.teamId),
          eq(members.isLeader, true),
          eq(members.active, true)
        ),
      });

      if (existingLeader) {
        throw new Error('Team already has a leader');
      }
    }

    const [member] = await db.insert(members).values({
      name: data.name,
      email: data.email,
      phone: data.phone,
      isLeader: data.isLeader,
      teamId: data.teamId,
      active: true,
    }).returning();

    return this.mapToDto(member);
  }

  /**
   * Busca um membro pelo ID
   * @param id ID do membro
   * @param includeTeam Se deve incluir a equipe do membro
   * @returns O membro encontrado ou null
   */
  async findById(id: string, includeTeam: boolean = false): Promise<MemberDto | null> {
    const member = await db.query.members.findFirst({
      where: eq(members.id, id),
    });

    if (!member) {
      return null;
    }

    const memberDto = this.mapToDto(member);

    if (includeTeam) {
      const team = await db.query.teams.findFirst({
        where: eq(teams.id, member.teamId),
      });

      if (team) {
        memberDto.team = {
          id: team.id,
          name: team.name,
          teamType: team.teamType,
          createdAt: team.createdAt,
          updatedAt: team.updatedAt,
        };
      }
    }

    return memberDto;
  }

  /**
   * Busca todos os membros com filtros opcionais
   * @param filters Filtros para a busca
   * @returns Lista de membros
   */
  async findAll(filters: MemberFiltersDto): Promise<MemberDto[]> {
    const conditions = [];

    if (filters.name) {
      conditions.push(ilike(members.name, `%${filters.name}%`));
    }

    if (filters.email) {
      conditions.push(ilike(members.email, `%${filters.email}%`));
    }

    if (filters.isLeader !== undefined) {
      conditions.push(eq(members.isLeader, filters.isLeader));
    }

    if (filters.teamId) {
      conditions.push(eq(members.teamId, filters.teamId));
    }

    if (filters.active !== undefined) {
      conditions.push(eq(members.active, filters.active));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const membersList = await db.query.members.findMany({
      where: whereClause,
    });

    return membersList.map(member => this.mapToDto(member));
  }

  /**
   * Atualiza um membro
   * @param id ID do membro
   * @param data Dados para atualização
   * @returns O membro atualizado ou null se não encontrado
   */
  async update(id: string, data: UpdateMemberDto): Promise<MemberDto | null> {
    const existingMember = await db.query.members.findFirst({
      where: eq(members.id, id),
    });

    if (!existingMember) {
      return null;
    }

    // Verificar se o email já está em uso por outro membro
    if (data.email && data.email !== existingMember.email) {
      const emailInUse = await db.query.members.findFirst({
        where: and(
          eq(members.email, data.email),
          or(
            eq(members.id, id),
            eq(members.id, id)
          )
        ),
      });

      if (emailInUse) {
        throw new Error('Email already in use');
      }
    }

    // Se estiver alterando a equipe, verificar se a nova equipe existe
    if (data.teamId && data.teamId !== existingMember.teamId) {
      const team = await teamRepository.findById(data.teamId);
      if (!team) {
        throw new Error('Team not found');
      }
    }

    // Se estiver alterando o status de líder, verificar as regras
    if (data.isLeader !== undefined && data.isLeader !== existingMember.isLeader) {
      // Se estiver tornando o membro um líder, verificar se já existe outro líder na equipe
      if (data.isLeader) {
        const teamId = data.teamId || existingMember.teamId;
        const existingLeader = await db.query.members.findFirst({
          where: and(
            eq(members.teamId, teamId),
            eq(members.isLeader, true),
            eq(members.active, true),
            or(
              eq(members.id, id),
              eq(members.id, id)
            )
          ),
        });

        if (existingLeader) {
          throw new Error('Team already has a leader');
        }
      }
      // Se estiver removendo o status de líder, verificar se é o único líder da equipe
      else if (existingMember.isLeader) {
        const otherLeaders = await db.query.members.findMany({
          where: and(
            eq(members.teamId, existingMember.teamId),
            eq(members.isLeader, true),
            eq(members.active, true),
            or(
              eq(members.id, id),
              eq(members.id, id)
            )
          ),
        });

        if (otherLeaders.length <= 1) {
          throw new Error('Team must have at least one leader');
        }
      }
    }

    const [updatedMember] = await db.update(members)
      .set({
        name: data.name !== undefined ? data.name : existingMember.name,
        email: data.email !== undefined ? data.email : existingMember.email,
        phone: data.phone !== undefined ? data.phone : existingMember.phone,
        isLeader: data.isLeader !== undefined ? data.isLeader : existingMember.isLeader,
        teamId: data.teamId !== undefined ? data.teamId : existingMember.teamId,
        updatedAt: new Date(),
      })
      .where(eq(members.id, id))
      .returning();

    return this.mapToDto(updatedMember);
  }

  /**
   * Atualiza o status de um membro
   * @param id ID do membro
   * @param data Dados para atualização de status
   * @returns O membro atualizado ou null se não encontrado
   */
  async updateStatus(id: string, data: UpdateMemberStatusDto): Promise<MemberDto | null> {
    const existingMember = await db.query.members.findFirst({
      where: eq(members.id, id),
    });

    if (!existingMember) {
      return null;
    }

    // Se estiver desativando um líder, verificar se é o único líder da equipe
    if (!data.active && existingMember.isLeader && existingMember.active) {
      const otherLeaders = await db.query.members.findMany({
        where: and(
          eq(members.teamId, existingMember.teamId),
          eq(members.isLeader, true),
          eq(members.active, true),
          or(
            eq(members.id, id),
            eq(members.id, id)
          )
        ),
      });

      if (otherLeaders.length <= 1) {
        throw new Error('Team must have at least one active leader');
      }
    }

    const [updatedMember] = await db.update(members)
      .set({
        active: data.active,
        updatedAt: new Date(),
      })
      .where(eq(members.id, id))
      .returning();

    return this.mapToDto(updatedMember);
  }

  /**
   * Exclui um membro
   * @param id ID do membro
   * @returns true se excluído com sucesso, false se não encontrado
   */
  async delete(id: string): Promise<boolean> {
    const existingMember = await db.query.members.findFirst({
      where: eq(members.id, id),
    });

    if (!existingMember) {
      return false;
    }

    // Se for um líder, verificar se é o único líder da equipe
    if (existingMember.isLeader) {
      const otherLeaders = await db.query.members.findMany({
        where: and(
          eq(members.teamId, existingMember.teamId),
          eq(members.isLeader, true),
          or(
            eq(members.id, id),
            eq(members.id, id)
          )
        ),
      });

      if (otherLeaders.length <= 1) {
        throw new Error('Team must have at least one leader');
      }
    }

    const result = await db.delete(members).where(eq(members.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  /**
   * Mapeia um registro da tabela para um DTO
   * @param member Registro da tabela
   * @returns DTO do membro
   */
  private mapToDto(member: typeof members.$inferSelect): MemberDto {
    return {
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
    };
  }
}

export const memberRepository = new MemberRepository();
