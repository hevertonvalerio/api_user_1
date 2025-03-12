import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  server: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  security: {
    apiKey: process.env.API_KEY || 'default-api-key',
  },
  database: {
    url: process.env.DATABASE_URL || '',
  },
};

// Validate required environment variables
const requiredEnvVars = ['API_KEY', 'DATABASE_URL'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}
