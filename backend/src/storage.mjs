import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const defaultPath = fileURLToPath(
  new URL('../data/connectwell.sqlite', import.meta.url)
);

const databasePath =
  process.env.DATABASE_PATH?.trim() || defaultPath;

if (databasePath !== ':memory:') {
  mkdirSync(dirname(resolve(databasePath)), {
    recursive: true,
  });
}

export const db = new DatabaseSync(databasePath);
db.exec('PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS accounts(id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, hash TEXT NOT NULL, salt TEXT NOT NULL); CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY, user_id TEXT NOT NULL, expires INTEGER NOT NULL); CREATE TABLE IF NOT EXISTS demos(id TEXT PRIMARY KEY, data TEXT NOT NULL);');
export const env={DB:{prepare(sql){const stmt=db.prepare(sql);return {bind(...values){return {async first(){return stmt.get(...values)},async run(){return stmt.run(...values)}}}}}}};
