import Database from 'better-sqlite3';
import path from 'path';

// مسار قاعدة البيانات
const DB_PATH = path.join(process.cwd(), 'dev.db');

// إنشاء/فتح قاعدة البيانات
let db;

function getDB() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initDB(db);
  }
  return db;
}

// إنشاء الجداول عند أول تشغيل
function initDB(database) {
  database.exec(`
    -- جدول المستخدمين الأساسي
    CREATE TABLE IF NOT EXISTS users (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      phone       TEXT    UNIQUE NOT NULL,
      password    TEXT    NOT NULL,
      full_name   TEXT    NOT NULL,
      role        TEXT    NOT NULL CHECK(role IN ('client', 'serviceProvider', 'admin')),
      is_verified INTEGER NOT NULL DEFAULT 0,
      otp_code    TEXT,
      otp_expires_at TEXT,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    -- جدول بيانات العملاء
    CREATE TABLE IF NOT EXISTS client_profiles (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      avatar_url TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- جدول بيانات مقدمي الخدمة
    CREATE TABLE IF NOT EXISTS provider_profiles (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id         INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      provider_type   TEXT NOT NULL CHECK(provider_type IN ('company', 'freelancer', 'exhibition')),
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

export default getDB;
