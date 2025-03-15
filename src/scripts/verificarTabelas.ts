import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function verificarTabelas() {
  try {
    const client = await pool.connect();
    
    console.log('Conectado ao banco de dados com sucesso!');
    
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('\nTabelas encontradas:');
    result.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });

    client.release();
  } catch (error: any) {
    console.error('Erro ao conectar ao banco de dados:', error.message);
  } finally {
    await pool.end();
  }
}

verificarTabelas();
