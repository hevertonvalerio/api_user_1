/**
 * DTO for creating a new neighborhood
 */
export interface CreateNeighborhoodDto {
  name: string;
  city: string;
}

/**
 * DTO for creating multiple neighborhoods in batch
 */
export interface CreateBatchNeighborhoodDto {
  city: string;
  neighborhoods: string[];
}

/**
 * DTO for updating a neighborhood
 */
export interface UpdateNeighborhoodDto {
  name?: string;
  city?: string;
}

/**
 * DTO for filtering neighborhoods
 */
export interface NeighborhoodFilters {
  name?: string;
  city?: string;
}

/**
 * DTO for neighborhood response
 */
export interface NeighborhoodDto {
  id: string;
  name: string;
  city: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO for neighborhood usage check response
 */
export interface NeighborhoodUsageDto {
  isUsed: boolean;
  usedIn: string[];
}
