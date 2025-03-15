import { BrokerProfileRepository } from '../repositories/BrokerProfileRepository';
import { BrokerProfile } from '../types/brokerProfile';
import logger from '../utils/logger';

export class BrokerProfileService {
  private brokerProfileRepository: BrokerProfileRepository;

  constructor() {
    this.brokerProfileRepository = new BrokerProfileRepository();
  }

  async create(data: Partial<BrokerProfile>): Promise<BrokerProfile> {
    try {
      // Validação dos campos obrigatórios
      if (!data.name) {
        throw new Error('Nome é obrigatório');
      }
      if (!data.email) {
        throw new Error('Email é obrigatório');
      }
      if (!data.phone) {
        throw new Error('Telefone é obrigatório');
      }
      if (!data.creci) {
        throw new Error('CRECI é obrigatório');
      }

      const profile = await this.brokerProfileRepository.create(data);
      logger.info(`BrokerProfileService: Perfil de corretor criado com sucesso - ID: ${profile.id}`);
      return profile;
    } catch (error: any) {
      logger.error(`BrokerProfileService: Erro ao criar perfil de corretor - ${error.message}`);
      throw error;
    }
  }

  async findById(id: string): Promise<BrokerProfile> {
    try {
      const profile = await this.brokerProfileRepository.findById(id);
      if (!profile) {
        throw new Error(`Perfil de corretor não encontrado com ID: ${id}`);
      }
      return profile;
    } catch (error: any) {
      logger.error(`BrokerProfileService: Erro ao buscar perfil de corretor - ${error.message}`);
      throw error;
    }
  }

  async update(id: string, data: Partial<BrokerProfile>): Promise<BrokerProfile> {
    try {
      // Verifica se o perfil existe
      await this.findById(id);

      const updatedProfile = await this.brokerProfileRepository.update(id, data);
      logger.info(`BrokerProfileService: Perfil de corretor atualizado com sucesso - ID: ${id}`);
      return updatedProfile;
    } catch (error: any) {
      logger.error(`BrokerProfileService: Erro ao atualizar perfil de corretor - ${error.message}`);
      throw error;
    }
  }

  async softDelete(id: string): Promise<void> {
    try {
      // Verifica se o perfil existe
      await this.findById(id);

      await this.brokerProfileRepository.softDelete(id);
      logger.info(`BrokerProfileService: Perfil de corretor deletado com sucesso - ID: ${id}`);
    } catch (error: any) {
      logger.error(`BrokerProfileService: Erro ao deletar perfil de corretor - ${error.message}`);
      throw error;
    }
  }

  async list(): Promise<BrokerProfile[]> {
    try {
      const profiles = await this.brokerProfileRepository.list();
      return profiles;
    } catch (error: any) {
      logger.error(`BrokerProfileService: Erro ao listar perfis de corretor - ${error.message}`);
      throw error;
    }
  }

  async updateRegions(id: string, regionIds: string[]): Promise<BrokerProfile> {
    try {
      // Verifica se o perfil existe
      await this.findById(id);

      const updatedProfile = await this.brokerProfileRepository.updateRegions(id, regionIds);
      logger.info(`BrokerProfileService: Regiões atualizadas com sucesso para o perfil - ID: ${id}`);
      return updatedProfile;
    } catch (error: any) {
      logger.error(`BrokerProfileService: Erro ao atualizar regiões do perfil - ${error.message}`);
      throw error;
    }
  }

  async updateNeighborhoods(id: string, neighborhoodIds: string[]): Promise<BrokerProfile> {
    try {
      // Verifica se o perfil existe
      await this.findById(id);

      const updatedProfile = await this.brokerProfileRepository.updateNeighborhoods(id, neighborhoodIds);
      logger.info(`BrokerProfileService: Bairros atualizados com sucesso para o perfil - ID: ${id}`);
      return updatedProfile;
    } catch (error: any) {
      logger.error(`BrokerProfileService: Erro ao atualizar bairros do perfil - ${error.message}`);
      throw error;
    }
  }
}