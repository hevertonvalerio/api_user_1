import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { userService } from '../services/UserService';
import { AppError } from '../middlewares/ErrorHandlerMiddleware';
import logger from '../utils/logger';

/**
 * Controller para gerenciamento de usuários
 */
export class UserController {
  /**
   * Cria um novo usuário
   * @route POST /api/users
   */
  createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validar requisição
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.error('Erro de validação ao criar usuário:', errors.array());
        throw new AppError('Erro de validação dos dados', 400, 'VALIDATION_ERROR');
      }
      
      const userData = req.body;
      const user = await userService.createUser(userData);
      
      logger.info(`Usuário criado com sucesso: ${user.id}`);
      res.status(201).json({
        success: true,
        data: user,
        message: 'Usuário criado com sucesso',
      });
    } catch (error) {
      logger.error('Erro ao criar usuário:', error);
      next(error);
    }
  }

  /**
   * Atualiza um usuário existente
   * @route PUT /api/users/:userId
   */
  updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validar requisição
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.error('Erro de validação ao atualizar usuário:', errors.array());
        throw new AppError('Erro de validação dos dados', 400, 'VALIDATION_ERROR');
      }
      
      const userId = req.params.userId;
      const userData = req.body;
      const user = await userService.updateUser(userId, userData);
      
      logger.info(`Usuário atualizado com sucesso: ${userId}`);
      res.status(200).json({
        success: true,
        data: user,
        message: 'Usuário atualizado com sucesso',
      });
    } catch (error) {
      logger.error(`Erro ao atualizar usuário ${req.params.userId}:`, error);
      next(error);
    }
  }

  /**
   * Altera a senha de um usuário
   * @route PATCH /api/users/:userId/password
   */
  changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validar requisição
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.error('Erro de validação ao alterar senha:', errors.array());
        throw new AppError('Erro de validação dos dados', 400, 'VALIDATION_ERROR');
      }
      
      const userId = req.params.userId;
      const passwordData = req.body;
      const user = await userService.changePassword(userId, passwordData);
      
      logger.info(`Senha alterada com sucesso para o usuário: ${userId}`);
      res.status(200).json({
        success: true,
        data: user,
        message: 'Senha alterada com sucesso',
      });
    } catch (error) {
      logger.error(`Erro ao alterar senha do usuário ${req.params.userId}:`, error);
      next(error);
    }
  }

  /**
   * Remove logicamente um usuário (soft delete)
   * @route DELETE /api/users/:userId
   */
  softDeleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validar requisição
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.error('Erro de validação ao remover usuário:', errors.array());
        throw new AppError('Erro de validação dos dados', 400, 'VALIDATION_ERROR');
      }
      
      const userId = req.params.userId;
      const user = await userService.softDeleteUser(userId);
      
      logger.info(`Usuário removido com sucesso: ${userId}`);
      res.status(200).json({
        success: true,
        data: user,
        message: 'Usuário removido com sucesso',
      });
    } catch (error) {
      logger.error(`Erro ao remover usuário ${req.params.userId}:`, error);
      next(error);
    }
  }

  /**
   * Busca um usuário por parâmetros de consulta
   * @route GET /api/users
   */
  getUserByQuery = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validar requisição
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.error('Erro de validação ao buscar usuário:', errors.array());
        throw new AppError('Erro de validação dos dados', 400, 'VALIDATION_ERROR');
      }
      
      const queryParams = {
        id: req.query.id as string | undefined,
        email: req.query.email as string | undefined,
        phone: req.query.phone as string | undefined,
        includeDeleted: req.query.includeDeleted === 'true',
      };
      
      const user = await userService.getUserByQuery(queryParams);
      
      logger.info(`Usuário encontrado com sucesso: ${queryParams.id || queryParams.email || queryParams.phone}`);
      res.status(200).json({
        success: true,
        data: user,
        message: 'Usuário encontrado com sucesso',
      });
    } catch (error) {
      logger.error('Erro ao buscar usuário:', error);
      next(error);
    }
  }
}

// Exporta uma instância singleton
export const userController = new UserController();
