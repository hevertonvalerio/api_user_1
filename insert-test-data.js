const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Function to insert test data
async function insertTestData() {
  const client = await pool.connect();
  
  try {
    // Start a transaction
    await client.query('BEGIN');
    
    console.log('Connected to the database');
    console.log('Inserting test data...');
    
    // Insert a test region if it doesn't exist
    const regionResult = await client.query(`
      INSERT INTO regions (id, name, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      ON CONFLICT (name) DO NOTHING
      RETURNING id, name
    `, [uuidv4(), 'Região de Teste']);
    
    let regionId;
    if (regionResult.rows.length > 0) {
      regionId = regionResult.rows[0].id;
      console.log(`Created region: ${regionResult.rows[0].name} (${regionId})`);
    } else {
      // Get the existing region ID
      const existingRegion = await client.query('SELECT id FROM regions WHERE name = $1', ['Região de Teste']);
      regionId = existingRegion.rows[0].id;
      console.log(`Using existing region: Região de Teste (${regionId})`);
    }
    
    // Insert a test neighborhood if it doesn't exist
    const neighborhoodResult = await client.query(`
      INSERT INTO neighborhoods (id, name, city, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      ON CONFLICT (name, city) DO NOTHING
      RETURNING id, name, city
    `, [uuidv4(), 'Bairro de Teste', 'Cidade de Teste']);
    
    let neighborhoodId;
    if (neighborhoodResult.rows.length > 0) {
      neighborhoodId = neighborhoodResult.rows[0].id;
      console.log(`Created neighborhood: ${neighborhoodResult.rows[0].name}, ${neighborhoodResult.rows[0].city} (${neighborhoodId})`);
    } else {
      // Get the existing neighborhood ID
      const existingNeighborhood = await client.query('SELECT id FROM neighborhoods WHERE name = $1 AND city = $2', ['Bairro de Teste', 'Cidade de Teste']);
      neighborhoodId = existingNeighborhood.rows[0].id;
      console.log(`Using existing neighborhood: Bairro de Teste, Cidade de Teste (${neighborhoodId})`);
    }
    
    // Insert a test broker profile
    const brokerProfileId = uuidv4();
    await client.query(`
      INSERT INTO broker_profiles (id, type, creci, creci_type, classification, created_at, updated_at, deleted, deleted_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), false, NULL)
    `, [brokerProfileId, 'Venda', 'CRECI-12345', 'Definitivo', 5]);
    
    console.log(`Created broker profile: ${brokerProfileId}`);
    
    // Associate the broker profile with the region
    await client.query(`
      INSERT INTO broker_regions (broker_id, region_id, created_at)
      VALUES ($1, $2, NOW())
    `, [brokerProfileId, regionId]);
    
    console.log(`Associated broker profile with region`);
    
    // Associate the broker profile with the neighborhood
    await client.query(`
      INSERT INTO broker_neighborhoods (broker_id, neighborhood_id, created_at)
      VALUES ($1, $2, NOW())
    `, [brokerProfileId, neighborhoodId]);
    
    console.log(`Associated broker profile with neighborhood`);
    
    // Commit the transaction
    await client.query('COMMIT');
    
    console.log('Test data inserted successfully');
    
    // Query the broker_profiles table
    const brokerProfilesResult = await client.query('SELECT * FROM broker_profiles');
    console.log('\nBroker Profiles:');
    console.log(brokerProfilesResult.rows);
    
    // Query the broker_regions table
    const brokerRegionsResult = await client.query('SELECT * FROM broker_regions');
    console.log('\nBroker Regions:');
    console.log(brokerRegionsResult.rows);
    
    // Query the broker_neighborhoods table
    const brokerNeighborhoodsResult = await client.query('SELECT * FROM broker_neighborhoods');
    console.log('\nBroker Neighborhoods:');
    console.log(brokerNeighborhoodsResult.rows);
    
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query('ROLLBACK');
    console.error('Error inserting test data:', error);
  } finally {
    // Release the client
    client.release();
    // Close the pool
    await pool.end();
  }
}

// Execute the function
insertTestData();
