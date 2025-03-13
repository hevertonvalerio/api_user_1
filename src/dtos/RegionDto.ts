import { NeighborhoodDto } from './NeighborhoodDto';

/**
 * DTO for creating a new region
 */
export interface CreateRegionDto {
  name: string;
  neighborhood_ids?: string[];
}

/**
 * DTO for updating a region
 */
export interface UpdateRegionDto {
  name?: string;
}

/**
 * DTO for updating region neighborhoods
 */
export interface UpdateRegionNeighborhoodsDto {
  neighborhood_ids: string[];
}

/**
 * DTO for adding neighborhoods to a region
 */
export interface AddNeighborhoodsDto {
  neighborhood_ids: string[];
}

/**
 * DTO for filtering regions
 */
export interface RegionFilters {
  name?: string;
  include_neighborhoods?: boolean;
}

/**
 * DTO for region response
 */
export interface RegionDto {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  neighborhoods?: NeighborhoodDto[];
}

/**
 * DTO for region usage check response
 */
export interface RegionUsageDto {
  isUsed: boolean;
  usedIn: string[];
}
