import { Request, Response } from 'express';
import { memberService } from '../services/MemberService';
import { CreateMemberDto, MemberFiltersDto, UpdateMemberDto, UpdateMemberStatusDto } from '../dtos/MemberDto';

class MemberController {
  /**
   * Cria um novo membro
   * @param req Requisição
   * @param res Resposta
   */
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data: CreateMemberDto = req.body;
      const member = await memberService.create(data);

      return res.status(201).json({
        success: true,
        data: member,
        message: 'Member created successfully',
      });
    } catch (error: any) {
      if (error.message === 'Email already in use') {
        return res.status(409).json({
          success: false,
          error: {
            code: 'CONFLICT',
            message: error.message,
          },
        });
      }

      if (error.message === 'Team not found') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message,
          },
        });
      }

      if (error.message === 'Team already has a leader') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: error.message,
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to create member',
        },
      });
    }
  }

  /**
   * Busca um membro pelo ID
   * @param req Requisição
   * @param res Resposta
   */
  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const includeTeam = req.query.include_team === 'true';

      const member = await memberService.findById(id, includeTeam);

      if (!member) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Member not found',
          },
        });
      }

      return res.status(200).json({
        success: true,
        data: member,
        message: 'Member retrieved successfully',
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to retrieve member',
        },
      });
    }
  }

  /**
   * Busca todos os membros com filtros opcionais
   * @param req Requisição
   * @param res Resposta
   */
  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const filters: MemberFiltersDto = {
        name: req.query.name as string | undefined,
        email: req.query.email as string | undefined,
        isLeader: req.query.is_leader === 'true' ? true : req.query.is_leader === 'false' ? false : undefined,
        teamId: req.query.team_id as string | undefined,
        active: req.query.active === 'true' ? true : req.query.active === 'false' ? false : undefined,
      };

      const members = await memberService.findAll(filters);

      return res.status(200).json({
        success: true,
        data: members,
        message: 'Members retrieved successfully',
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to retrieve members',
        },
      });
    }
  }

  /**
   * Atualiza um membro
   * @param req Requisição
   * @param res Resposta
   */
  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data: UpdateMemberDto = req.body;

      const member = await memberService.update(id, data);

      if (!member) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Member not found',
          },
        });
      }

      return res.status(200).json({
        success: true,
        data: member,
        message: 'Member updated successfully',
      });
    } catch (error: any) {
      if (error.message === 'Email already in use') {
        return res.status(409).json({
          success: false,
          error: {
            code: 'CONFLICT',
            message: error.message,
          },
        });
      }

      if (error.message === 'Team not found') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message,
          },
        });
      }

      if (error.message === 'Team already has a leader' || error.message === 'Team must have at least one leader') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: error.message,
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to update member',
        },
      });
    }
  }

  /**
   * Atualiza o status de um membro
   * @param req Requisição
   * @param res Resposta
   */
  async updateStatus(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data: UpdateMemberStatusDto = req.body;

      const member = await memberService.updateStatus(id, data);

      if (!member) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Member not found',
          },
        });
      }

      return res.status(200).json({
        success: true,
        data: member,
        message: 'Member status updated successfully',
      });
    } catch (error: any) {
      if (error.message === 'Team must have at least one active leader') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: error.message,
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to update member status',
        },
      });
    }
  }

  /**
   * Exclui um membro
   * @param req Requisição
   * @param res Resposta
   */
  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const deleted = await memberService.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Member not found',
          },
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Member deleted successfully',
      });
    } catch (error: any) {
      if (error.message === 'Team must have at least one leader') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: error.message,
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to delete member',
        },
      });
    }
  }
}

export const memberController = new MemberController();
