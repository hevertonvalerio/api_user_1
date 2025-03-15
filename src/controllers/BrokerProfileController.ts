import { Request, Response } from 'express';
import { BrokerProfileService } from '../services/BrokerProfileService';
import logger from '../utils/logger';

class BrokerProfileController {
  private brokerProfileService: BrokerProfileService;

  constructor() {
    this.brokerProfileService = new BrokerProfileService();
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const profile = await this.brokerProfileService.create(req.body);
      res.status(201).json({
        message: 'Perfil de corretor criado com sucesso',
        data: profile
      });
    } catch (error: any) {
      logger.error(`BrokerProfileController: Erro ao criar perfil de corretor - ${error.message}`);
      res.status(400).json({
        message: 'Erro ao criar perfil de corretor',
        error: error.message
      });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const profile = await this.brokerProfileService.findById(id);
      res.status(200).json({
        data: profile
      });
    } catch (error: any) {
      logger.error(`BrokerProfileController: Erro ao buscar perfil de corretor - ${error.message}`);
      res.status(404).json({
        message: 'Erro ao buscar perfil de corretor',
        error: error.message
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const profile = await this.brokerProfileService.update(id, req.body);
      res.status(200).json({
        message: 'Perfil de corretor atualizado com sucesso',
        data: profile
      });
    } catch (error: any) {
      logger.error(`BrokerProfileController: Erro ao atualizar perfil de corretor - ${error.message}`);
      res.status(404).json({
        message: 'Erro ao atualizar perfil de corretor',
        error: error.message
      });
    }
  }

  async softDelete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.brokerProfileService.softDelete(id);
      res.status(200).json({
        message: 'Perfil de corretor deletado com sucesso'
      });
    } catch (error: any) {
      logger.error(`BrokerProfileController: Erro ao deletar perfil de corretor - ${error.message}`);
      res.status(404).json({
        message: 'Erro ao deletar perfil de corretor',
        error: error.message
      });
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const profiles = await this.brokerProfileService.list();
      res.status(200).json({
        data: profiles
      });
    } catch (error: any) {
      logger.error(`BrokerProfileController: Erro ao listar perfis de corretor - ${error.message}`);
      res.status(400).json({
        message: 'Erro ao listar perfis de corretor',
        error: error.message
      });
    }
  }

  async updateRegions(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { regionIds } = req.body;
      const profile = await this.brokerProfileService.updateRegions(id, regionIds);
      res.status(200).json({
        message: 'Regiões atualizadas com sucesso',
        data: profile
      });
    } catch (error: any) {
      logger.error(`BrokerProfileController: Erro ao atualizar regiões do perfil - ${error.message}`);
      res.status(404).json({
        message: 'Erro ao atualizar regiões do perfil',
        error: error.message
      });
    }
  }

  async updateNeighborhoods(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { neighborhoodIds } = req.body;
      const profile = await this.brokerProfileService.updateNeighborhoods(id, neighborhoodIds);
      res.status(200).json({
        message: 'Bairros atualizados com sucesso',
        data: profile
      });
    } catch (error: any) {
      logger.error(`BrokerProfileController: Erro ao atualizar bairros do perfil - ${error.message}`);
      res.status(404).json({
        message: 'Erro ao atualizar bairros do perfil',
        error: error.message
      });
    }
  }
}

export const brokerProfileController = new BrokerProfileController();