import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function verificarEstrutura() {
  try {
    const client = await pool.connect();
    
    console.log('Conectado ao banco de dados com sucesso!');
    
    const result = await client.query(`
      SELECT column_name, data_type, character_maximum_length, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'broker_profiles'
      ORDER BY ordinal_position;
    `);
    
    console.log('\nEstrutura da tabela broker_profiles:');
    result.rows.forEach(row => {
      const tamanho = row.character_maximum_length ? `(${row.character_maximum_length})` : '';
      const nulo = row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
      console.log(`- ${row.column_name}: ${row.data_type}${tamanho} ${nulo}`);
    });

    client.release();
  } catch (error: any) {
    console.error('Erro ao conectar ao banco de dados:', error.message);
  } finally {
    await pool.end();
  }
}

verificarEstrutura();
