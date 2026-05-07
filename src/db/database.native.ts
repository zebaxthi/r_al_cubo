import * as SQLite from "expo-sqlite";

let dbInstance: SQLite.SQLiteDatabase | null = null;

export function getDb(): SQLite.SQLiteDatabase {
  if (!dbInstance) {
    dbInstance = SQLite.openDatabaseSync("r3_waste.db");
  }
  return dbInstance;
}

export function initDatabase(): void {
  const db = getDb();
  db.execSync(`
    CREATE TABLE IF NOT EXISTS waste_records (
      id TEXT PRIMARY KEY NOT NULL,
      waste_type TEXT NOT NULL,
      kilograms REAL NOT NULL,
      recorded_at TEXT NOT NULL,
      address_label TEXT,
      latitude REAL,
      longitude REAL,
      photo_uri TEXT,
      synced INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_waste_recorded_at ON waste_records(recorded_at DESC);
    CREATE INDEX IF NOT EXISTS idx_waste_synced ON waste_records(synced);
  `);
}

