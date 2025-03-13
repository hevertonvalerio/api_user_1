import { Request, Response } from 'express';
import { teamService } from '../services/TeamService';
import { memberService } from '../services/MemberService';
import { CreateTeamDto, TeamFiltersDto, UpdateTeamDto } from '../dtos/TeamDto';
import logger from '../utils/logger';

class TeamController {
  /**
   * Cria uma nova equipe
   * @param req Requisição
   * @param res Resposta
   */
  async create(req: Request, res: Response): Promise<Response> {
    try {
      logger.info(`Creating team: ${JSON.stringify(req.body)}`);
      const data: CreateTeamDto = req.body;
      const team = await teamService.create(data);
      logger.info(`Team created with ID: ${team.id}`);

      return res.status(201).json({
        success: true,
        data: team,
        message: 'Team created successfully',
      });
    } catch (error: any) {
      logger.error(`Error creating team: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to create team',
        },
      });
    }
  }

  /**
   * Busca uma equipe pelo ID
   * @param req Requisição
   * @param res Resposta
   */
  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const includeMembers = req.query.include_members === 'true';
      logger.info(`Getting team with ID: ${id}, includeMembers: ${includeMembers}`);

      const team = await teamService.findById(id, includeMembers);

      if (!team) {
        logger.warn(`Team not found with ID: ${id}`);
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Team not found',
          },
        });
      }

      logger.info(`Team found with ID: ${id}`);
      return res.status(200).json({
        success: true,
        data: team,
        message: 'Team retrieved successfully',
      });
    } catch (error: any) {
      logger.error(`Error retrieving team with ID ${req.params.id}: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to retrieve team',
        },
      });
    }
  }

  /**
   * Busca todas as equipes com filtros opcionais
   * @param req Requisição
   * @param res Resposta
   */
  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      logger.info(`Getting teams with filters: ${JSON.stringify(req.query)}`);
      
      const filters: TeamFiltersDto = {
        name: req.query.name as string | undefined,
        teamType: req.query.team_type as any, // Convertido para o tipo correto no serviço
        includeMembers: req.query.include_members === 'true',
      };

      const teams = await teamService.findAll(filters);
      logger.info(`Found ${teams.length} teams`);

      return res.status(200).json({
        success: true,
        data: teams,
        message: 'Teams retrieved successfully',
      });
    } catch (error: any) {
      logger.error(`Error retrieving teams: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to retrieve teams',
        },
      });
    }
  }

  /**
   * Atualiza uma equipe
   * @param req Requisição
   * @param res Resposta
   */
  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data: UpdateTeamDto = req.body;
      logger.info(`Updating team with ID: ${id}, data: ${JSON.stringify(data)}`);

      const team = await teamService.update(id, data);

      if (!team) {
        logger.warn(`Team not found with ID: ${id}`);
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Team not found',
          },
        });
      }

      logger.info(`Team updated with ID: ${id}`);
      return res.status(200).json({
        success: true,
        data: team,
        message: 'Team updated successfully',
      });
    } catch (error: any) {
      logger.error(`Error updating team with ID ${req.params.id}: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to update team',
        },
      });
    }
  }

  /**
   * Define um membro como líder da equipe
   * @param req Requisição
   * @param res Resposta
   */
  async setLeader(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { member_id } = req.body;
      logger.info(`Setting member ${member_id} as leader of team ${id}`);

      await teamService.setLeader(id, member_id);

      logger.info(`Member ${member_id} set as leader of team ${id}`);
      return res.status(200).json({
        success: true,
        message: 'Team leader set successfully',
      });
    } catch (error: any) {
      if (error.message === 'Team not found' || error.message === 'Member not found') {
        logger.warn(`Not found error: ${error.message}`);
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message,
          },
        });
      }

      if (error.message === 'Member does not belong to this team' || error.message === 'Team already has a leader') {
        logger.warn(`Bad request error: ${error.message}`);
        return res.status(400).json({
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: error.message,
          },
        });
      }

      logger.error(`Error setting team leader: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to set team leader',
        },
      });
    }
  }

  /**
   * Exclui uma equipe
   * @param req Requisição
   * @param res Resposta
   */
  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      logger.info(`Deleting team with ID: ${id}`);

      const deleted = await teamService.delete(id);

      if (!deleted) {
        logger.warn(`Team not found with ID: ${id}`);
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Team not found',
          },
        });
      }

      logger.info(`Team deleted with ID: ${id}`);
      return res.status(200).json({
        success: true,
        message: 'Team deleted successfully',
      });
    } catch (error: any) {
      logger.error(`Error deleting team with ID ${req.params.id}: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to delete team',
        },
      });
    }
  }

  /**
   * Busca os membros de uma equipe
   * @param req Requisição
   * @param res Resposta
   */
  async findMembers(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const onlyActive = req.query.active === 'true';
      logger.info(`Getting members of team with ID: ${id}, onlyActive: ${onlyActive}`);

      const members = await teamService.findMembers(id, onlyActive);
      logger.info(`Found ${members.length} members for team with ID: ${id}`);

      return res.status(200).json({
        success: true,
        data: members,
        message: 'Team members retrieved successfully',
      });
    } catch (error: any) {
      if (error.message === 'Team not found') {
        logger.warn(`Team not found with ID: ${req.params.id}`);
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message,
          },
        });
      }

      logger.error(`Error retrieving members of team with ID ${req.params.id}: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to retrieve team members',
        },
      });
    }
  }
}

export const teamController = new TeamController();
