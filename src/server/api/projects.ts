import { Router } from 'express';
import { SQLiteProjectRepository } from '../repositories/ProjectRepository.ts';
import { authenticate, authorizeAdmin } from './middleware.ts';

const router = Router();
const projectRepository = new SQLiteProjectRepository();

router.get('/', async (req, res) => {
  try {
    const projects = await projectRepository.findAll();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const project = await projectRepository.findBySlug(req.params.slug);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project' });
  }
});

router.post('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const project = await projectRepository.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error creating project' });
  }
});

router.put('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const project = await projectRepository.update(req.params.id, req.body);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error updating project' });
  }
});

router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const success = await projectRepository.delete(req.params.id);
    if (!success) return res.status(404).json({ message: 'Project not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project' });
  }
});

export default router;
