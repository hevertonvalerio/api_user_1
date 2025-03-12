import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, pool } from './client';
import path from 'path';
import { userTypes } from './schema';

// Path to the migrations folder
const migrationsFolder = path.join(__dirname, '../../drizzle');

// Run migrations
async function runMigrations() {
  console.log('Running migrations...');
  
  try {
    await migrate(db, { migrationsFolder });
    console.log('Migrations completed successfully');
    
    // Seed initial user types if needed
    await seedUserTypes();
    
    // Close the pool
    await pool.end();
  } catch (error) {
    console.error('Migration failed:', error);
    await pool.end();
    process.exit(1);
  }
}

// Seed initial user types
async function seedUserTypes() {
  console.log('Checking if user types need to be seeded...');
  
  // Check if user types already exist
  const existingUserTypes = await db.select().from(userTypes);
  
  if (existingUserTypes.length === 0) {
    console.log('Seeding user types...');
    
    // Insert user types
    try {
      await db.insert(userTypes).values([
        { id: 1, name: 'Admin' },
        { id: 2, name: 'Gerente' },
        { id: 3, name: 'Corretor' },
        { id: 4, name: 'Usuário' },
      ]);
      console.log('User types seeded successfully');
    } catch (error) {
      console.error('Failed to seed user types:', error);
    }
  } else {
    console.log('User types already exist, skipping seed');
  }
}

// Run migrations
runMigrations();
