import { Router } from 'express';
import { SQLiteBlogRepository } from '../repositories/BlogRepository.ts';
import { authenticate, authorizeAdmin } from './middleware.ts';

const router = Router();
const blogRepository = new SQLiteBlogRepository();

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  try {
    const result = await blogRepository.findAll(page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

// Inside src/server/api/blog.ts
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const blogRepository = new SQLiteBlogRepository();
    const post = await blogRepository.findBySlug(slug); // Make sure this method exists!

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post' });
  }
});

router.post('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const post = await blogRepository.create(req.body);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post' });
  }
});

router.put('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const post = await blogRepository.update(req.params.id, req.body);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error updating post' });
  }
});

router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const success = await blogRepository.delete(req.params.id);
    if (!success) return res.status(404).json({ message: 'Post not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post' });
  }
});

export default router;
