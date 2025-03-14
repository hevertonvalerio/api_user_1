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
    
    // Check if the broker_profiles table exists
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('broker_profiles', 'broker_regions', 'broker_neighborhoods')
    `);
    
    console.log('Tables found:');
    console.log(tablesResult.rows);
    
    // Query the broker_profiles table
    try {
      const brokerProfilesResult = await client.query('SELECT * FROM broker_profiles');
      console.log('\nBroker Profiles:');
      console.log(brokerProfilesResult.rows);
    } catch (err) {
      console.log('\nError querying broker_profiles table:', err.message);
    }
    
    // Query the broker_regions table
    try {
      const brokerRegionsResult = await client.query('SELECT * FROM broker_regions');
      console.log('\nBroker Regions:');
      console.log(brokerRegionsResult.rows);
    } catch (err) {
      console.log('\nError querying broker_regions table:', err.message);
    }
    
    // Query the broker_neighborhoods table
    try {
      const brokerNeighborhoodsResult = await client.query('SELECT * FROM broker_neighborhoods');
      console.log('\nBroker Neighborhoods:');
      console.log(brokerNeighborhoodsResult.rows);
    } catch (err) {
      console.log('\nError querying broker_neighborhoods table:', err.message);
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
