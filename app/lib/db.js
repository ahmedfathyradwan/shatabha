import { createClient } from '@libsql/client';

// ============================================================
// قاعدة البيانات - Turso (SQLite in the Cloud)
// متغيرات البيئة المطلوبة في Vercel:
//   TURSO_DATABASE_URL  - رابط قاعدة البيانات (libsql://...)
//   TURSO_AUTH_TOKEN    - مفتاح التوثيق
// للتشغيل المحلي: DATABASE_URL=file:./dev.db (بدون AUTH_TOKEN)
// ============================================================

let client;

function getDB() {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || 'file:./dev.db';
    const authToken = process.env.TURSO_AUTH_TOKEN;

    client = createClient({
      url,
      authToken: authToken || undefined,
    });
  }
  return client;
}

// إنشاء الجداول عند أول طلب
export async function initDB() {
  const db = getDB();
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      phone           TEXT    UNIQUE NOT NULL,
      password        TEXT    NOT NULL,
      full_name       TEXT    NOT NULL,
      role            TEXT    NOT NULL,
      is_verified     INTEGER NOT NULL DEFAULT 0,
      otp_code        TEXT,
      otp_expires_at  TEXT,
      created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS client_profiles (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      avatar_url TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS provider_profiles (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id         INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      provider_type   TEXT NOT NULL,
      address         TEXT,
      avatar_url      TEXT,
      bio             TEXT,
      rating          REAL DEFAULT 0,
      specialization  TEXT,
      job_title       TEXT,
      avg_price       REAL,
      exhibition_type TEXT,
      created_at      TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

export function normalizePhone(phone) {
  if (!phone) return '';
  return phone
    .toString()
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
    .replace(/[^0-9]/g, '')
    .trim();
}

export default getDB;
