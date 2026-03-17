import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'mine_safety.db');
const db = new Database(dbPath);

// Initialize table
db.exec(`
  CREATE TABLE IF NOT EXISTS workers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    battery INTEGER DEFAULT 0,
    heartRate INTEGER DEFAULT 0,
    temperature REAL DEFAULT 0.0,
    gasLevel INTEGER DEFAULT 0,
    beltStatus TEXT DEFAULT 'U',
    helmetStatus TEXT DEFAULT 'N',
    rssi INTEGER DEFAULT -100,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;