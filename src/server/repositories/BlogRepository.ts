import { v4 as uuidv4 } from 'uuid';
import db from '../infrastructure/db.ts';
import { Post } from '../domain/entities.ts';

export interface IBlogRepository {
  findAll(page: number, limit: number): Promise<{ posts: Post[], total: number }>;
  findBySlug(slug: string): Promise<Post | null>;
  create(post: Omit<Post, 'id' | 'published_at' | 'updated_at'> & { published_at?: string }): Promise<Post>;
  update(id: string, post: Partial<Post>): Promise<Post | null>;
  delete(id: string): Promise<boolean>;
}

export class SQLiteBlogRepository implements IBlogRepository {
  async findAll(page: number = 1, limit: number = 10): Promise<{ posts: Post[], total: number }> {
    const offset = (page - 1) * limit;
    const total = (db.prepare('SELECT COUNT(*) as count FROM posts').get() as any).count;
    const rows = db.prepare('SELECT * FROM posts ORDER BY published_at DESC LIMIT ? OFFSET ?').all(limit, offset);
    
    const posts = rows.map(row => ({
      ...row,
      tags: JSON.parse(row.tags || '[]')
    })) as Post[];

    return { posts, total };
  }

async findBySlug(slug: string): Promise<Post | null> {
  const row = db.prepare('SELECT * FROM posts WHERE slug = ?').get(slug);
  if (!row) return null;
  return {
    ...row,
    tags: JSON.parse(row.tags || '[]')
  } as Post;
}

  async create(data: Omit<Post, 'id' | 'published_at' | 'updated_at'> & { published_at?: string }): Promise<Post> {
    const id = uuidv4();
    const now = new Date().toISOString();
    const publishedAt = data.published_at || now;
    const tags = JSON.stringify(data.tags);
    const author = (data as any).author || null;
    
    db.prepare(`
      INSERT INTO posts (id, title, slug, excerpt, content, author, cover_image, tags, status, published_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.title, data.slug, data.excerpt, data.content, author, data.cover_image, tags, data.status, publishedAt, now);

    return { ...data, id, published_at: publishedAt, updated_at: now } as Post;
  }

  async update(id: string, data: Partial<Post>): Promise<Post | null> {
    const current = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
    if (!current) return null;

    const now = new Date().toISOString();
    const updates: string[] = [];
    const values: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (key === 'id') return;
      updates.push(`${key} = ?`);
      if (key === 'tags') {
        values.push(JSON.stringify(value));
      } else {
        values.push(value);
      }
    });

    updates.push('updated_at = ?');
    values.push(now);
    values.push(id);

    db.prepare(`UPDATE posts SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    const updated = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
    return {
      ...updated,
      tags: JSON.parse(updated.tags || '[]')
    } as Post;
  }

  async delete(id: string): Promise<boolean> {
    const result = db.prepare('DELETE FROM posts WHERE id = ?').run(id);
    return result.changes > 0;
  }
}
function getDb() {
  throw new Error('Function not implemented.');
}

