// Default entrypoint.
// En web se usa `database.web.ts` y en móvil se usa `database.native.ts`.
// Este archivo intencionalmente NO referencia `expo-sqlite` para no romper web.

export function getDb(): never {
  throw new Error("SQLite no configurado (usa database.web.ts o database.native.ts).");
}

export function initDatabase(): void {
  // no-op por defecto
}
