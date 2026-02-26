import { v4 as uuidv4 } from 'uuid';
import db from '../infrastructure/db.ts';
import { Message } from '../domain/entities.ts';

export interface IMessageRepository {
  findAll(): Promise<Message[]>;
  create(message: Omit<Message, 'id' | 'created_at' | 'is_read'>): Promise<Message>;
  markAsRead(id: string): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}

export class SQLiteMessageRepository implements IMessageRepository {
  async findAll(): Promise<Message[]> {
    const rows = db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all();
    return rows.map(row => ({
      ...row,
      is_read: Boolean(row.is_read)
    })) as Message[];
  }

  async create(data: Omit<Message, 'id' | 'created_at' | 'is_read'>): Promise<Message> {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    db.prepare(`
      INSERT INTO messages (id, name, email, subject, message, is_read, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.name, data.email, data.subject, data.message, 0, now);

    return { ...data, id, is_read: false, created_at: now } as Message;
  }

  async markAsRead(id: string): Promise<boolean> {
    const result = db.prepare('UPDATE messages SET is_read = 1 WHERE id = ?').run(id);
    return result.changes > 0;
  }

  async delete(id: string): Promise<boolean> {
    const result = db.prepare('DELETE FROM messages WHERE id = ?').run(id);
    return result.changes > 0;
  }
}
