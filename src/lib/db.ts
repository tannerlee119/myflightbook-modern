import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Lazy initialization — only connects when first queried at runtime
// This prevents build-time errors when DATABASE_URL isn't set
function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL environment variable is not set. ' +
      'Create a Neon database in your Vercel project dashboard and link it.'
    );
  }
  const sql = neon(url);
  return drizzle(sql, { schema });
}

// Use a getter so it's only created on first access (at request time, not build time)
let _db: ReturnType<typeof createDb> | null = null;

export const db = new Proxy({} as ReturnType<typeof createDb>, {
  get(_target, prop) {
    if (!_db) _db = createDb();
    return (_db as unknown as Record<string | symbol, unknown>)[prop];
  },
});
