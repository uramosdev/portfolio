import { v4 as uuidv4 } from 'uuid';
import db from '../infrastructure/db.ts';
import { User } from '../domain/entities';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(user: Omit<User, 'id' | 'created_at'>): Promise<User>;
  updatePassword(id: string, password: string): Promise<boolean>;
}

export class SQLiteUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    return row as User || null;
  }

  async findById(id: string): Promise<User | null> {
    const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    return row as User || null;
  }

  async create(data: Omit<User, 'id' | 'created_at'>): Promise<User> {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    db.prepare(`
      INSERT INTO users (id, email, password, role, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, data.email, data.password, data.role, now);

    return { ...data, id, created_at: now } as User;
  }

  async updatePassword(id: string, password: string): Promise<boolean> {
  const result = db.prepare('UPDATE users SET password = ? WHERE id = ?').run(password, id);
  return result.changes > 0;
}
}
