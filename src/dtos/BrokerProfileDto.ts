import { brokerTypeEnum, creciTypeEnum } from '../db/schema';
import { RegionDto } from './RegionDto';
import { NeighborhoodDto } from './NeighborhoodDto';

export type BrokerType = typeof brokerTypeEnum.enumValues[number];
export type CreciType = typeof creciTypeEnum.enumValues[number];

export interface BrokerProfileDto {
  id: string;
  type: BrokerType;
  creci: string;
  creciType: CreciType;
  classification: number;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
  deletedAt: Date | null;
  regions?: RegionDto[];
  neighborhoods?: NeighborhoodDto[];
}

export interface CreateBrokerProfileDto {
  type: BrokerType;
  creci: string;
  creciType: CreciType;
  classification?: number;
  regions?: string[];
  neighborhoods?: string[];
}

export interface UpdateBrokerProfileDto {
  type?: BrokerType;
  creci?: string;
  creciType?: CreciType;
  classification?: number;
}

export interface BrokerProfileFilters {
  type?: BrokerType;
  creciType?: CreciType;
  classification?: number;
  regionId?: string;
  neighborhoodId?: string;
  page?: number;
  limit?: number;
  includeRegions?: boolean;
  includeNeighborhoods?: boolean;
  includeDeleted?: boolean;
}

export interface BrokerProfileQueryOptions {
  includeRegions?: boolean;
  includeNeighborhoods?: boolean;
}

export interface UpdateRegionsDto {
  regionIds: string[];
}

export interface UpdateNeighborhoodsDto {
  neighborhoodIds: string[];
}
