import { v4 as uuidv4 } from 'uuid';
import db from '../infrastructure/db.ts';
import { About } from '../domain/entities.ts';

export interface IAboutRepository {
  get(): Promise<About | null>;
  update(data: Partial<About>): Promise<About>;
}

export class SQLiteAboutRepository implements IAboutRepository {
  async get(): Promise<About | null> {
    const row = db.prepare('SELECT * FROM about LIMIT 1').get();
    if (!row) return null;
    return {
      ...row,
      tech_stack: JSON.parse(row.tech_stack || '[]'),
      social_links: JSON.parse(row.social_links || '[]')
    } as About;
  }

  async update(data: Partial<About>): Promise<About> {
    const current = await this.get();
    const now = new Date().toISOString();

    if (!current) {
      const id = uuidv4();
      const tech_stack = JSON.stringify(data.tech_stack || []);
      const social_links = JSON.stringify(data.social_links || []);
      
      db.prepare(`
        INSERT INTO about (id, name, title, bio, location, whatsapp, avatar_url, tech_stack, social_links, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, data.name || '', data.title || '', data.bio || '', data.location || '', data.whatsapp || '', data.avatar_url || '', tech_stack, social_links, now);
      
      return (await this.get())!;
    }

    const updates: string[] = [];
    const values: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (key === 'id') return;
      updates.push(`${key} = ?`);
      if (key === 'tech_stack' || key === 'social_links') {
        values.push(JSON.stringify(value));
      } else {
        values.push(value);
      }
    });

    updates.push('updated_at = ?');
    values.push(now);
    values.push(current.id);

    db.prepare(`UPDATE about SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    return (await this.get())!;
  }
}
