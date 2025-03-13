import { z } from 'zod';
import { teamTypeEnum } from '../db/schema';

// Enum para tipos de equipe
export const TeamTypeEnum = z.enum(teamTypeEnum.enumValues);
export type TeamType = z.infer<typeof TeamTypeEnum>;

// DTO para criação de equipe
export const CreateTeamDto = z.object({
  name: z.string().min(1).max(100),
  teamType: TeamTypeEnum,
});
export type CreateTeamDto = z.infer<typeof CreateTeamDto>;

// DTO para atualização de equipe
export const UpdateTeamDto = z.object({
  name: z.string().min(1).max(100).optional(),
  teamType: TeamTypeEnum.optional(),
});
export type UpdateTeamDto = z.infer<typeof UpdateTeamDto>;

// DTO para filtros de equipe
export const TeamFiltersDto = z.object({
  name: z.string().optional(),
  teamType: TeamTypeEnum.optional(),
  includeMembers: z.boolean().optional().default(false),
});
export type TeamFiltersDto = z.infer<typeof TeamFiltersDto>;

// Interface para representação de equipe
export interface TeamDto {
  id: string;
  name: string;
  teamType: string;
  createdAt: Date;
  updatedAt: Date;
  members?: MemberDto[];
}

// Interface para representação de equipe com membros
export interface TeamWithMembersDto extends TeamDto {
  members: MemberDto[];
}

// Importação circular para MemberDto
import { MemberDto } from './MemberDto';
