import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function migrarTabela() {
  try {
    const client = await pool.connect();
    
    console.log('Conectado ao banco de dados com sucesso!');
    
    // Criar enum status_type
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE status_type AS ENUM ('active', 'inactive', 'deleted');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    console.log('Enum status_type criado com sucesso');

    // Adicionar novas colunas
    await client.query(`
      ALTER TABLE broker_profiles
      ADD COLUMN IF NOT EXISTS name varchar(255) NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS email varchar(255) NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS phone varchar(20) NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS status status_type NOT NULL DEFAULT 'active',
      ADD COLUMN IF NOT EXISTS regions text[] NOT NULL DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS neighborhoods text[] NOT NULL DEFAULT '{}';
    `);
    console.log('Novas colunas adicionadas com sucesso');

    // Adicionar índice único para email
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS broker_profiles_email_idx ON broker_profiles (email);
    `);
    console.log('Índice único para email criado com sucesso');

    // Remover colunas antigas que não serão mais usadas
    await client.query(`
      ALTER TABLE broker_profiles
      DROP COLUMN IF EXISTS type,
      DROP COLUMN IF EXISTS creci_type,
      DROP COLUMN IF EXISTS classification,
      DROP COLUMN IF EXISTS deleted;
    `);
    console.log('Colunas antigas removidas com sucesso');

    client.release();
    console.log('\nMigração concluída com sucesso!');
  } catch (error: any) {
    console.error('Erro durante a migração:', error.message);
  } finally {
    await pool.end();
  }
}

migrarTabela();
