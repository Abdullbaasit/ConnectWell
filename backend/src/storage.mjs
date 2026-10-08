import {DatabaseSync} from 'node:sqlite';
import {mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const directory=fileURLToPath(new URL('../data/',import.meta.url));mkdirSync(directory,{recursive:true});
export const db=new DatabaseSync(process.env.DATABASE_PATH||directory+'connectwell.sqlite');
db.exec('PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS accounts(id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, hash TEXT NOT NULL, salt TEXT NOT NULL); CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY, user_id TEXT NOT NULL, expires INTEGER NOT NULL); CREATE TABLE IF NOT EXISTS demos(id TEXT PRIMARY KEY, data TEXT NOT NULL);');
export const env={DB:{prepare(sql){const stmt=db.prepare(sql);return {bind(...values){return {async first(){return stmt.get(...values)},async run(){return stmt.run(...values)}}}}}}};
