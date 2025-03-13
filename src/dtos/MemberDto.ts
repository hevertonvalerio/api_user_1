import { z } from 'zod';

// DTO para criação de membro
export const CreateMemberDto = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(100),
  phone: z.string().min(1).max(20),
  isLeader: z.boolean().default(false),
  teamId: z.string().uuid(),
});
export type CreateMemberDto = z.infer<typeof CreateMemberDto>;

// DTO para atualização de membro
export const UpdateMemberDto = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().max(100).optional(),
  phone: z.string().min(1).max(20).optional(),
  isLeader: z.boolean().optional(),
  teamId: z.string().uuid().optional(),
});
export type UpdateMemberDto = z.infer<typeof UpdateMemberDto>;

// DTO para atualização de status do membro
export const UpdateMemberStatusDto = z.object({
  active: z.boolean(),
});
export type UpdateMemberStatusDto = z.infer<typeof UpdateMemberStatusDto>;

// DTO para filtros de membro
export const MemberFiltersDto = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  isLeader: z.boolean().optional(),
  teamId: z.string().uuid().optional(),
  active: z.boolean().optional(),
});
export type MemberFiltersDto = z.infer<typeof MemberFiltersDto>;

// Interface para representação de membro
export interface MemberDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  isLeader: boolean;
  teamId: string;
  joinedAt: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  team?: TeamDto;
}

// Interface para representação de membro com equipe
export interface MemberWithTeamDto extends MemberDto {
  team: TeamDto;
}

// Importação circular para TeamDto
import { TeamDto } from './TeamDto';
