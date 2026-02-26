import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize tables
export function initDb() {
  // Users table (Admin)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // About table
  db.exec(`
    CREATE TABLE IF NOT EXISTS about (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      bio TEXT NOT NULL,
      avatar_url TEXT,
      tech_stack TEXT, -- JSON string
      social_links TEXT, -- JSON string
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Migrations for About table
  try {
    db.exec("ALTER TABLE about ADD COLUMN location TEXT");
  } catch (e) {
    // Column might already exist
  }
  try {
    db.exec("ALTER TABLE about ADD COLUMN whatsapp TEXT");
  } catch (e) {
    // Column might already exist
  }

  // Projects table
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      content TEXT,
      image_url TEXT,
      github_url TEXT,
      live_url TEXT,
      technologies TEXT, -- JSON string
      is_featured BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Blog posts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      cover_image TEXT,
      tags TEXT, -- JSON string
      status TEXT DEFAULT 'published', -- 'draft' or 'published'
      published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Migrations for Posts table
  try {
    db.exec("ALTER TABLE posts ADD COLUMN author TEXT");
  } catch (e) {
    // Column might already exist
  }

  // Contact messages
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Database initialized successfully.');
}

export default db;
