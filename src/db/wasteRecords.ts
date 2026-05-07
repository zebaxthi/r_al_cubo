import { Platform } from "react-native";
import { getDb } from "./database";

export type WasteType = "plastic" | "paper" | "metal" | "glass";

export type WasteRecordRow = {
  id: string;
  waste_type: WasteType;
  kilograms: number;
  recorded_at: string;
  address_label: string | null;
  latitude: number | null;
  longitude: number | null;
  photo_uri: string | null;
  synced: number;
  created_at: string;
  updated_at: string;
};

const isWeb = Platform.OS === "web";

// Web-only demo store: usamos datos en memoria para que la UI navegue sin depender
// de módulos nativos/SQLite/cámara en el navegador.
let webStore: WasteRecordRow[] | null = null;

function isoDaysAgo(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  // Hora fija para estabilidad visual
  d.setHours(12, 0, 0, 0);
  return d.toISOString();
}

function seedWebStore() {
  const now = new Date().toISOString();
  const mk = (args: {
    id: string;
    waste_type: WasteType;
    kilograms: number;
    daysAgo: number;
    address_label: string;
    synced: 0 | 1;
  }): WasteRecordRow => ({
    id: args.id,
    waste_type: args.waste_type,
    kilograms: args.kilograms,
    recorded_at: isoDaysAgo(args.daysAgo),
    address_label: args.address_label,
    latitude: null,
    longitude: null,
    photo_uri: null,
    synced: args.synced,
    created_at: now,
    updated_at: now,
  });

  // Cerca del mock visual: mezcla de tipos + un "PENDIENTE"
  webStore = [
    mk({ id: "w1", waste_type: "plastic", kilograms: 12.5, daysAgo: 3, address_label: "Av. Industrial Norte, 4520", synced: 1 }),
    mk({ id: "w2", waste_type: "metal", kilograms: 8.2, daysAgo: 5, address_label: "Zona Industrial Sur", synced: 1 }),
    mk({ id: "w3", waste_type: "paper", kilograms: 6.8, daysAgo: 6, address_label: "Centro de Acopio Norte", synced: 1 }),
    mk({ id: "w4", waste_type: "glass", kilograms: 4.9, daysAgo: 7, address_label: "Mercado Municipal", synced: 0 }),
    mk({ id: "w5", waste_type: "plastic", kilograms: 15.3, daysAgo: 10, address_label: "Planta de Reciclaje Alpha", synced: 1 }),
    mk({ id: "w6", waste_type: "metal", kilograms: 22.0, daysAgo: 11, address_label: "Bodega Industrial 3", synced: 1 }),
  ];
}

function ensureWebStore() {
  if (!webStore) seedWebStore();
  return webStore!;
}

type SQLiteDatabaseLike = {
  execSync?: (sql: string) => void;
  runSync: (sql: string, params: unknown[]) => unknown;
  getFirstSync: <T>(sql: string, params?: unknown[]) => T | null;
  getAllSync: <T>(sql: string, params?: unknown[]) => T[];
};

function db(): SQLiteDatabaseLike {
  return getDb() as unknown as SQLiteDatabaseLike;
}

function sumBy(records: WasteRecordRow[], pred: (r: WasteRecordRow) => boolean) {
  let s = 0;
  for (const r of records) if (pred(r)) s += r.kilograms;
  return s;
}

export function insertWasteRecord(input: {
  wasteType: WasteType;
  kilograms: number;
  recordedAt: Date;
  addressLabel: string | null;
  latitude: number | null;
  longitude: number | null;
  photoUri: string | null;
  synced?: boolean;
}): string {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const now = new Date().toISOString();
  const synced = input.synced === true ? 1 : 0;

  if (isWeb) {
    const store = ensureWebStore();
    const row: WasteRecordRow = {
      id,
      waste_type: input.wasteType,
      kilograms: input.kilograms,
      recorded_at: input.recordedAt.toISOString(),
      address_label: input.addressLabel,
      latitude: input.latitude,
      longitude: input.longitude,
      photo_uri: input.photoUri,
      synced,
      created_at: now,
      updated_at: now,
    };
    store.unshift(row);
    return id;
  }

  db().runSync(
    `INSERT INTO waste_records (
      id, waste_type, kilograms, recorded_at, address_label, latitude, longitude, photo_uri, synced, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      input.wasteType,
      input.kilograms,
      input.recordedAt.toISOString(),
      input.addressLabel,
      input.latitude,
      input.longitude,
      input.photoUri,
      synced,
      now,
      now,
    ]
  );
  return id;
}

export function getTotals(): { totalKg: number; count: number } {
  if (isWeb) {
    const store = ensureWebStore();
    const totalKg = store.reduce((a, r) => a + r.kilograms, 0);
    return { totalKg, count: store.length };
  }

  const row = db().getFirstSync<{ s: number | null; c: number | null }>(
    `SELECT SUM(kilograms) as s, COUNT(*) as c FROM waste_records`
  );
  return {
    totalKg: row?.s ?? 0,
    count: row?.c ?? 0,
  };
}

export function getWeeklyProgress(reference: Date = new Date()): {
  weekSumKg: number;
  weekStart: Date;
  weekEnd: Date;
} {
  const start = new Date(reference);
  const day = start.getDay();
  const diff = (day + 6) % 7; // lunes = inicio
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - diff);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  if (isWeb) {
    const store = ensureWebStore();
    const weekSumKg = sumBy(store, (r) => {
      const t = new Date(r.recorded_at).getTime();
      return t >= start.getTime() && t < end.getTime();
    });
    return { weekSumKg, weekStart: start, weekEnd: end };
  }

  const row = db().getFirstSync<{ s: number | null }>(
    `SELECT SUM(kilograms) as s FROM waste_records WHERE recorded_at >= ? AND recorded_at < ?`,
    [start.toISOString(), end.toISOString()]
  );
  return {
    weekSumKg: row?.s ?? 0,
    weekStart: start,
    weekEnd: end,
  };
}

/** Kilograms recorded in the last 7 days from `until` (inclusive). */
export function getLast7DaysSum(until: Date = new Date()): number {
  const from = new Date(until);
  from.setDate(from.getDate() - 7);

  if (isWeb) {
    const store = ensureWebStore();
    return sumBy(store, (r) => {
      const t = new Date(r.recorded_at).getTime();
      return t >= from.getTime() && t <= until.getTime();
    });
  }

  const row = db().getFirstSync<{ s: number | null }>(
    `SELECT SUM(kilograms) as s FROM waste_records WHERE recorded_at >= ? AND recorded_at <= ?`,
    [from.toISOString(), until.toISOString()]
  );
  return row?.s ?? 0;
}

export function getPrevious7DaysSum(until: Date = new Date()): number {
  const end = new Date(until);
  end.setDate(end.getDate() - 7);
  const start = new Date(end);
  start.setDate(start.getDate() - 7);

  if (isWeb) {
    const store = ensureWebStore();
    return sumBy(store, (r) => {
      const t = new Date(r.recorded_at).getTime();
      return t >= start.getTime() && t < end.getTime();
    });
  }

  const row = db().getFirstSync<{ s: number | null }>(
    `SELECT SUM(kilograms) as s FROM waste_records WHERE recorded_at >= ? AND recorded_at < ?`,
    [start.toISOString(), end.toISOString()]
  );
  return row?.s ?? 0;
}

export function listRecent(limit = 5): WasteRecordRow[] {
  if (isWeb) {
    return ensureWebStore()
      .slice()
      .sort((a, b) => (a.recorded_at < b.recorded_at ? 1 : -1))
      .slice(0, limit);
  }

  return db().getAllSync<WasteRecordRow>(
    `SELECT * FROM waste_records ORDER BY recorded_at DESC LIMIT ?`,
    [limit]
  );
}

export function searchRecords(query: string): WasteRecordRow[] {
  const q = query.trim().toLowerCase();
  if (!q) return listAllOrdered();

  if (isWeb) {
    const store = ensureWebStore();
    return store
      .filter((r) => {
        const type = r.waste_type.toLowerCase();
        const address = (r.address_label ?? "").toLowerCase();
        const recorded = r.recorded_at.toLowerCase();
        return type.includes(q) || address.includes(q) || recorded.includes(q);
      })
      .slice()
      .sort((a, b) => (a.recorded_at < b.recorded_at ? 1 : -1));
  }

  const like = `%${query.trim()}%`;
  return db().getAllSync<WasteRecordRow>(
    `SELECT * FROM waste_records
     WHERE waste_type LIKE ? OR address_label LIKE ? OR recorded_at LIKE ?
     ORDER BY recorded_at DESC`,
    [like, like, like]
  );
}

export function getById(id: string): WasteRecordRow | null {
  if (isWeb) {
    return ensureWebStore().find((r) => r.id === id) ?? null;
  }
  return db().getFirstSync<WasteRecordRow>(
    `SELECT * FROM waste_records WHERE id = ?`,
    [id]
  );
}

export function listAllOrdered(): WasteRecordRow[] {
  if (isWeb) {
    return ensureWebStore()
      .slice()
      .sort((a, b) => (a.recorded_at < b.recorded_at ? 1 : -1));
  }

  return db().getAllSync<WasteRecordRow>(
    `SELECT * FROM waste_records ORDER BY recorded_at DESC`
  );
}

export function countUnsynced(): number {
  if (isWeb) {
    return ensureWebStore().filter((r) => r.synced === 0).length;
  }

  const row = db().getFirstSync<{ c: number }>(
    `SELECT COUNT(*) as c FROM waste_records WHERE synced = 0`
  );
  return row?.c ?? 0;
}
