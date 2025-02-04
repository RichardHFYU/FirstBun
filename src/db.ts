import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

// Ensure your PostgreSQL connection URL is set in your environment (DATABASE_URL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);
