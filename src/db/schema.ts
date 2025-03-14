import { pgTable, uuid, varchar, timestamp, boolean, integer, pgEnum, uniqueIndex, primaryKey } from 'drizzle-orm/pg-core';

// Define user types enum
export const userTypeEnum = pgEnum('user_type', ['Admin', 'Gerente', 'Corretor', 'Usuário']);

// Define team types enum
export const teamTypeEnum = pgEnum('team_type', ['Corretores', 'Cadastro', 'Jurídico', 'Atendimento', 'Administrativo']);

// Define broker types enum
export const brokerTypeEnum = pgEnum('broker_type', ['Locação', 'Venda', 'Híbrido']);

// Define CRECI types enum
export const creciTypeEnum = pgEnum('creci_type', ['Definitivo', 'Estagiário', 'Matrícula']);

// Define user_types table
export const userTypes = pgTable('user_types', {
  id: integer('id').primaryKey().notNull(),
  name: varchar('name', { length: 50 }).notNull(),
});

// Define users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  userTypeId: integer('user_type_id').references(() => userTypes.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deleted: boolean('deleted').default(false).notNull(),
  deletedAt: timestamp('deleted_at'),
});

// Define neighborhoods table
export const neighborhoods = pgTable('neighborhoods', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    nameAndCityIndex: uniqueIndex('neighborhoods_name_city_idx').on(table.name, table.city)
  };
});

// Define regions table
export const regions = pgTable('regions', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Define region_neighborhoods junction table
export const regionNeighborhoods = pgTable('region_neighborhoods', {
  regionId: uuid('region_id').notNull().references(() => regions.id, { onDelete: 'cascade' }),
  neighborhoodId: uuid('neighborhood_id').notNull().references(() => neighborhoods.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    pk: uniqueIndex('region_neighborhoods_pk').on(table.regionId, table.neighborhoodId)
  };
});

// Define teams table
export const teams = pgTable('teams', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  teamType: teamTypeEnum('team_type').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Define members table
export const members = pgTable('members', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }).notNull(),
  isLeader: boolean('is_leader').default(false).notNull(),
  teamId: uuid('team_id').references(() => teams.id, { onDelete: 'cascade' }).notNull(),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Define broker_profiles table
export const brokerProfiles = pgTable('broker_profiles', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  type: brokerTypeEnum('type').notNull(),
  creci: varchar('creci', { length: 50 }).notNull(),
  creciType: creciTypeEnum('creci_type').notNull(),
  classification: integer('classification').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deleted: boolean('deleted').default(false).notNull(),
  deletedAt: timestamp('deleted_at'),
});

// Define broker_regions junction table
export const brokerRegions = pgTable('broker_regions', {
  brokerId: uuid('broker_id').notNull().references(() => brokerProfiles.id, { onDelete: 'cascade' }),
  regionId: uuid('region_id').notNull().references(() => regions.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.brokerId, table.regionId] })
  };
});

// Define broker_neighborhoods junction table
export const brokerNeighborhoods = pgTable('broker_neighborhoods', {
  brokerId: uuid('broker_id').notNull().references(() => brokerProfiles.id, { onDelete: 'cascade' }),
  neighborhoodId: uuid('neighborhood_id').notNull().references(() => neighborhoods.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.brokerId, table.neighborhoodId] })
  };
});

// Export all schemas
export const schema = {
  userTypes,
  users,
  neighborhoods,
  regions,
  regionNeighborhoods,
  teams,
  members,
  brokerProfiles,
  brokerRegions,
  brokerNeighborhoods,
};
