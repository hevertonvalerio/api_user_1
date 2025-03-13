import { CreateMemberDto, MemberDto, MemberFiltersDto, UpdateMemberDto, UpdateMemberStatusDto } from '../dtos/MemberDto';
import { memberRepository } from '../repositories/MemberRepository';
import { teamRepository } from '../repositories/TeamRepository';

class MemberService {
  /**
   * Cria um novo membro
   * @param data Dados do membro a ser criado
   * @returns O membro criado
   */
  async create(data: CreateMemberDto): Promise<MemberDto> {
    // Verificar se a equipe existe
    const team = await teamRepository.findById(data.teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    return memberRepository.create(data);
  }

  /**
   * Busca um membro pelo ID
   * @param id ID do membro
   * @param includeTeam Se deve incluir a equipe do membro
   * @returns O membro encontrado ou null
   */
  async findById(id: string, includeTeam: boolean = false): Promise<MemberDto | null> {
    return memberRepository.findById(id, includeTeam);
  }

  /**
   * Busca todos os membros com filtros opcionais
   * @param filters Filtros para a busca
   * @returns Lista de membros
   */
  async findAll(filters: MemberFiltersDto): Promise<MemberDto[]> {
    return memberRepository.findAll(filters);
  }

  /**
   * Atualiza um membro
   * @param id ID do membro
   * @param data Dados para atualização
   * @returns O membro atualizado ou null se não encontrado
   */
  async update(id: string, data: UpdateMemberDto): Promise<MemberDto | null> {
    // Verificar se o membro existe
    const existingMember = await memberRepository.findById(id);
    if (!existingMember) {
      return null;
    }

    // Se estiver alterando a equipe, verificar se a nova equipe existe
    if (data.teamId && data.teamId !== existingMember.teamId) {
      const team = await teamRepository.findById(data.teamId);
      if (!team) {
        throw new Error('Team not found');
      }
    }

    return memberRepository.update(id, data);
  }

  /**
   * Atualiza o status de um membro
   * @param id ID do membro
   * @param data Dados para atualização de status
   * @returns O membro atualizado ou null se não encontrado
   */
  async updateStatus(id: string, data: UpdateMemberStatusDto): Promise<MemberDto | null> {
    // Verificar se o membro existe
    const existingMember = await memberRepository.findById(id);
    if (!existingMember) {
      return null;
    }

    return memberRepository.updateStatus(id, data);
  }

  /**
   * Exclui um membro
   * @param id ID do membro
   * @returns true se excluído com sucesso, false se não encontrado
   */
  async delete(id: string): Promise<boolean> {
    // Verificar se o membro existe
    const existingMember = await memberRepository.findById(id);
    if (!existingMember) {
      return false;
    }

    // Se for um líder, verificar se é o único líder da equipe
    if (existingMember.isLeader) {
      const teamMembers = await teamRepository.findMembers(existingMember.teamId, true);
      const leaders = teamMembers.filter(member => member.isLeader);
      
      if (leaders.length <= 1) {
        throw new Error('Team must have at least one leader');
      }
    }

    return memberRepository.delete(id);
  }
}

export const memberService = new MemberService();
