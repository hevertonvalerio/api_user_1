const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Function to query the database
async function queryDatabase() {
  try {
    // Connect to the database
    const client = await pool.connect();
    
    console.log('Connected to the database');
    
    // Check if the users and user_types tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'user_types')
    `);
    
    console.log('Tables found:');
    console.log(tablesResult.rows);
    
    // Query the user_types table
    try {
      const userTypesResult = await client.query('SELECT * FROM user_types');
      console.log('\nUser Types:');
      console.log(userTypesResult.rows);
    } catch (err) {
      console.log('\nError querying user_types table:', err.message);
    }
    
// Query the users table structure
    try {
      const usersStructureResult = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'users'
      `);
      console.log('\nUsers table structure:');
      console.log(usersStructureResult.rows);
      
      // Query the users table data
      const usersResult = await client.query('SELECT * FROM users LIMIT 5');
      console.log('\nUsers sample data:');
      console.log(usersResult.rows);
    } catch (err) {
      console.log('\nError querying users table:', err.message);
    }
    
// List all tables in the database
    try {
      const allTablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
      console.log('\nAll tables in database:');
      console.log(allTablesResult.rows);
    } catch (err) {
      console.log('\nError listing all tables:', err.message);
    }
    
    // Get database name
    try {
      const dbNameResult = await client.query(`SELECT current_database()`);
      console.log('\nCurrent database:');
      console.log(dbNameResult.rows);
    } catch (err) {
      console.log('\nError getting database name:', err.message);
    }
    
    // Release the client
    client.release();
  } catch (error) {
    console.error('Error querying the database:', error);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Execute the query
queryDatabase();
