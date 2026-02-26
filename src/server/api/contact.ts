import { Router } from 'express';
import { SQLiteMessageRepository } from '../repositories/MessageRepository.ts';
import { authenticate, authorizeAdmin } from './middleware.ts';
import { Resend } from 'resend';

const router = Router();
const messageRepository = new SQLiteMessageRepository();
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Rate limiting placeholder (simple in-memory for demo)
const ipLimits = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_MESSAGES = 5;

router.post('/', async (req, res) => {
  const ip = req.ip || 'unknown';
  const lastMessages = ipLimits.get(ip) || 0;

  if (lastMessages >= MAX_MESSAGES) {
    return res.status(429).json({ message: 'Too many messages. Please try again later.' });
  }

  try {
    const message = await messageRepository.create(req.body);
    ipLimits.set(ip, lastMessages + 1);

    // Send email notification if Resend is configured
    if (resend) {
      try {
        await resend.emails.send({
          from: 'Portfolio Contact <onboarding@resend.dev>',
          to: process.env.ADMIN_EMAIL || 'admin@example.com',
          subject: `New Contact Message: ${req.body.subject}`,
          html: `
            <h3>New Message from ${req.body.name}</h3>
            <p><strong>Email:</strong> ${req.body.email}</p>
            <p><strong>Subject:</strong> ${req.body.subject}</p>
            <p><strong>Message:</strong></p>
            <p>${req.body.message}</p>
          `,
        });
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        // We don't fail the request if email fails, as the message is saved in DB
      }
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message' });
  }
});

router.get('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const messages = await messageRepository.findAll();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

router.patch('/:id/read', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const success = await messageRepository.markAsRead(req.params.id);
    if (!success) return res.status(404).json({ message: 'Message not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error updating message' });
  }
});

router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const success = await messageRepository.delete(req.params.id);
    if (!success) return res.status(404).json({ message: 'Message not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message' });
  }
});

export default router;
