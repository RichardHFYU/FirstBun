import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

// Ensure your PostgreSQL connection URL is set in your environment (DATABASE_URL)
const pool = new Pool({
  connectionString: "postgres://postgres:Abcd1234@localhost:5432/postgres?options=-c%20search_path=agents",
});

export const db = drizzle(pool);
