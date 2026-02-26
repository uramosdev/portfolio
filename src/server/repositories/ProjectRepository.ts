import { v4 as uuidv4 } from 'uuid';
import db from '../infrastructure/db.ts';
import { Project } from '../domain/entities.ts';

export interface IProjectRepository {
  findAll(): Promise<Project[]>;
  findBySlug(slug: string): Promise<Project | null>;
  create(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project>;
  update(id: string, project: Partial<Project>): Promise<Project | null>;
  delete(id: string): Promise<boolean>;
}

export class SQLiteProjectRepository implements IProjectRepository {
  async findAll(): Promise<Project[]> {
    const rows = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
    return rows.map(row => ({
      ...row,
      technologies: JSON.parse(row.technologies || '[]'),
      is_featured: Boolean(row.is_featured)
    })) as Project[];
  }

  async findBySlug(slug: string): Promise<Project | null> {
    const row = db.prepare('SELECT * FROM projects WHERE slug = ?').get(slug);
    if (!row) return null;
    return {
      ...row,
      technologies: JSON.parse(row.technologies || '[]'),
      is_featured: Boolean(row.is_featured)
    } as Project;
  }

  async create(data: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    const id = uuidv4();
    const now = new Date().toISOString();
    const technologies = JSON.stringify(data.technologies);
    
    db.prepare(`
      INSERT INTO projects (id, title, slug, description, content, image_url, github_url, live_url, technologies, is_featured, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.title, data.slug, data.description, data.content, data.image_url, data.github_url, data.live_url, technologies, data.is_featured ? 1 : 0, now, now);

    return { ...data, id, created_at: now, updated_at: now } as Project;
  }

  async update(id: string, data: Partial<Project>): Promise<Project | null> {
    const current = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    if (!current) return null;

    const now = new Date().toISOString();
    const updates: string[] = [];
    const values: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (key === 'id' || key === 'created_at') return;
      updates.push(`${key} = ?`);
      if (key === 'technologies') {
        values.push(JSON.stringify(value));
      } else if (key === 'is_featured') {
        values.push(value ? 1 : 0);
      } else {
        values.push(value);
      }
    });

    updates.push('updated_at = ?');
    values.push(now);
    values.push(id);

    db.prepare(`UPDATE projects SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    const updated = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    return {
      ...updated,
      technologies: JSON.parse(updated.technologies || '[]'),
      is_featured: Boolean(updated.is_featured)
    } as Project;
  }

  async delete(id: string): Promise<boolean> {
    const result = db.prepare('DELETE FROM projects WHERE id = ?').run(id);
    return result.changes > 0;
  }
}
