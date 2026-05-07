import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { Database, Statement } from 'sqlite';

let dbInstance: Database | null = null;

export async function initDB() {
  if (dbInstance) return dbInstance;

  dbInstance = await open({
    filename: './database.db',
    driver: sqlite3.Database,
  });

  try {
    const res = await dbInstance.migrate({
      migrationsPath: path.join(process.cwd(), 'migrations'),
      force: false,
    });
  } catch (error) {
    console.log(error);
  }
}

export const getDB = () => {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call initDB() first.');
  }
  return dbInstance;
};
