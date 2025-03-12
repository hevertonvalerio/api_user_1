import { pgTable, uuid, varchar, timestamp, boolean, integer, pgEnum } from 'drizzle-orm/pg-core';

// Define user types enum
export const userTypeEnum = pgEnum('user_type', ['Admin', 'Gerente', 'Corretor', 'Usuário']);

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

// Export all schemas
export const schema = {
  userTypes,
  users,
};
