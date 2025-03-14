import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { config } from '../config';
import * as schema from './schema';

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: config.database.url,
  ssl: false, // Desabilitar SSL para permitir conexão com servidores que não suportam SSL
});

// Create a Drizzle ORM instance with schema
export const db = drizzle(pool, { schema });

// Export the pool for use in migrations
export { pool };
