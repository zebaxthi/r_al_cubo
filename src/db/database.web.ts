// Web-only: en modo de prueba de UI evitamos `expo-sqlite` (WASM) para que
// `expo export --platform web` pueda construir y desplegar en Vercel como estático.

export function initDatabase(): void {
  // No-op en web
}

export function getDb(): never {
  throw new Error("SQLite no disponible en web (modo UI-only).");
}

