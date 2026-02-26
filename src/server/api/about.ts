import { Router } from 'express';
import { SQLiteAboutRepository } from '../repositories/AboutRepository.ts';
import { authenticate, authorizeAdmin } from './middleware.ts';

const router = Router();
const aboutRepository = new SQLiteAboutRepository();

router.get('/', async (req, res) => {
  try {
    const about = await aboutRepository.get();
    res.json(about);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching about info' });
  }
});

router.put('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const about = await aboutRepository.update(req.body);
    res.json(about);
  } catch (error) {
    res.status(500).json({ message: 'Error updating about info' });
  }
});

export default router;
