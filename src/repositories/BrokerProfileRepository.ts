import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { brokerProfiles } from '../db/schema';
import { BrokerProfile } from '../types/brokerProfile';
import logger from '../utils/logger';

export class BrokerProfileRepository {
  async create(data: Partial<BrokerProfile>): Promise<BrokerProfile> {
    try {
      const [profile] = await db.insert(brokerProfiles).values({
        name: data.name!,
        email: data.email!,
        phone: data.phone!,
        creci: data.creci!,
        status: 'active',
        regions: data.regions || [],
        neighborhoods: data.neighborhoods || [],
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      logger.info(`BrokerProfileRepository: Perfil de corretor criado com ID: ${profile.id}`);
      return profile;
    } catch (error: any) {
      logger.error(`BrokerProfileRepository: Erro ao criar perfil de corretor: ${error.message}`);
      throw error;
    }
  }

  async findById(id: string): Promise<BrokerProfile | null> {
    try {
      const [profile] = await db.select()
        .from(brokerProfiles)
        .where(eq(brokerProfiles.id, id));

      return profile || null;
    } catch (error: any) {
      logger.error(`BrokerProfileRepository: Erro ao buscar perfil de corretor: ${error.message}`);
      throw error;
    }
  }

  async update(id: string, data: Partial<BrokerProfile>): Promise<BrokerProfile> {
    try {
      const [updatedProfile] = await db.update(brokerProfiles)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(brokerProfiles.id, id))
        .returning();

      logger.info(`BrokerProfileRepository: Perfil de corretor atualizado com ID: ${id}`);
      return updatedProfile;
    } catch (error: any) {
      logger.error(`BrokerProfileRepository: Erro ao atualizar perfil de corretor: ${error.message}`);
      throw error;
    }
  }

  async softDelete(id: string): Promise<void> {
    try {
      await db.update(brokerProfiles)
        .set({
          status: 'deleted',
          deletedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(brokerProfiles.id, id));

      logger.info(`BrokerProfileRepository: Perfil de corretor marcado como deletado com ID: ${id}`);
    } catch (error: any) {
      logger.error(`BrokerProfileRepository: Erro ao deletar perfil de corretor: ${error.message}`);
      throw error;
    }
  }

  async list(): Promise<BrokerProfile[]> {
    try {
      const profiles = await db.select()
        .from(brokerProfiles)
        .where(eq(brokerProfiles.status, 'active'));

      return profiles;
    } catch (error: any) {
      logger.error(`BrokerProfileRepository: Erro ao listar perfis de corretor: ${error.message}`);
      throw error;
    }
  }

  async updateRegions(id: string, regionIds: string[]): Promise<BrokerProfile> {
    try {
      const [updatedProfile] = await db.update(brokerProfiles)
        .set({
          regions: regionIds,
          updatedAt: new Date()
        })
        .where(eq(brokerProfiles.id, id))
        .returning();

      logger.info(`BrokerProfileRepository: Regiões atualizadas para o perfil com ID: ${id}`);
      return updatedProfile;
    } catch (error: any) {
      logger.error(`BrokerProfileRepository: Erro ao atualizar regiões do perfil: ${error.message}`);
      throw error;
    }
  }

  async updateNeighborhoods(id: string, neighborhoodIds: string[]): Promise<BrokerProfile> {
    try {
      const [updatedProfile] = await db.update(brokerProfiles)
        .set({
          neighborhoods: neighborhoodIds,
          updatedAt: new Date()
        })
        .where(eq(brokerProfiles.id, id))
        .returning();

      logger.info(`BrokerProfileRepository: Bairros atualizados para o perfil com ID: ${id}`);
      return updatedProfile;
    } catch (error: any) {
      logger.error(`BrokerProfileRepository: Erro ao atualizar bairros do perfil: ${error.message}`);
      throw error;
    }
  }
}