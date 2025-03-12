import { UserTypeDto } from './UserTypeDto';

// DTO for user
export interface UserDto {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  userTypeId: number;
  userType?: UserTypeDto;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
  deletedAt?: Date;
}

// DTO for creating a user
export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
  userTypeId: number;
}

// DTO for updating a user
export interface UpdateUserDto {
  name?: string;
  email?: string;
  phone?: string;
  userTypeId?: number;
}

// DTO for changing user password
export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// DTO for user query parameters
export interface UserQueryDto {
  id?: string;
  email?: string;
  phone?: string;
  includeDeleted?: boolean;
}
