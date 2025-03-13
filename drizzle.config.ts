import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Parse the connection string
const connectionString = process.env.DATABASE_URL || '';
const url = new URL(connectionString);
const host = url.hostname;
const port = parseInt(url.port || '5432');
const user = url.username;
const password = url.password;
const database = url.pathname.substring(1);

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host,
    port,
    user,
    password,
    database,
    ssl: false, // Desabilitar SSL para permitir conexão com servidores que não suportam SSL
  },
  verbose: true,
  strict: true,
} satisfies Config;
