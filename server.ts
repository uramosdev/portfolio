import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { initDb } from './src/server/infrastructure/db.ts';
import bcrypt from 'bcryptjs';
import { SQLiteUserRepository } from './src/server/repositories/UserRepository.ts';
import { SQLiteAboutRepository } from './src/server/repositories/AboutRepository.ts';
import { SQLiteProjectRepository } from './src/server/repositories/ProjectRepository.ts';
import { SQLiteBlogRepository } from './src/server/repositories/BlogRepository.ts';
import { authenticate, authorizeAdmin } from './src/server/middleware/auth.ts';

// API Routers
import authRouter from './src/server/api/auth.ts';
import projectsRouter from './src/server/api/projects.ts';
import blogRouter from './src/server/api/blog.ts';
import aboutRouter from './src/server/api/about.ts';
import contactRouter from './src/server/api/contact.ts';
import uploadRouter from './src/server/api/upload.ts';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

async function startServer() {
  // Initialize Database
  initDb();

  // Create initial admin user if not exists
  const userRepository = new SQLiteUserRepository();
  const adminEmail = process.env.ADMIN_EMAIL || 'ramosubaldino91@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'morningstar14';
  const existingAdmin = await userRepository.findByEmail(adminEmail);
  
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await userRepository.create({
      email: adminEmail,
      password: hashedPassword,
      role: 'admin'
    });
    console.log(`Initial admin user created with email: ${adminEmail}`);
  } else {
    // Sync password if it's the admin from ENV
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await userRepository.updatePassword(existingAdmin.id!, hashedPassword);
    console.log(`Admin password synced for: ${adminEmail}`);
  }

  // Create initial about info if not exists
  const aboutRepository = new SQLiteAboutRepository();
  const existingAbout = await aboutRepository.get();
  if (!existingAbout) {
    await aboutRepository.update({
      name: 'Ubaldino Ramos',
      title: 'Web Developer',
      bio: 'Passionate about Clean Architecture, scalability, and building high-quality software products.',
      location: 'Panama City, PA',
      whatsapp: '+507 66021611',
      tech_stack: ['React', 'TypeScript', 'Node.js', 'FastAPI', 'MongoDB', 'Docker'],
      social_links: [
        { platform: 'GitHub', url: 'https://github.com' },
        { platform: 'LinkedIn', url: 'https://linkedin.com' }
      ]
    });
    console.log('Initial about information created.');
  } else if (existingAbout.name === 'John Doe') {
    // Update if it's still the default John Doe
    await aboutRepository.update({
      name: 'Ubaldino Ramos',
      title: 'Web Developer ',
      location: 'Panama City, PA',
      whatsapp: '+507 66021611'
    });
    console.log('About information updated from John Doe to Ubaldino Ramos.');
  } else if (!existingAbout.location || !existingAbout.whatsapp) {
    // Update existing record with defaults if fields are missing
    await aboutRepository.update({
      location: existingAbout.location || 'San Francisco, CA',
      whatsapp: existingAbout.whatsapp || '+1234567890'
    });
    console.log('About information updated with missing fields.');
  }

  // Seed Projects if none exist
  const projectRepository = new SQLiteProjectRepository();
  const existingProjects = await projectRepository.findAll();
  if (existingProjects.length === 0) {
    const fakeProjects = [
      {
        title: 'E-commerce Platform',
        slug: 'ecommerce-platform',
        description: 'A full-featured e-commerce solution built with React and Node.js.',
        content: '# E-commerce Platform\n\nThis project is a high-performance e-commerce platform...',
        image_url: 'https://picsum.photos/seed/shop/800/600',
        github_url: 'https://github.com',
        live_url: 'https://example.com',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
        is_featured: true
      },
      {
        title: 'AI Task Manager',
        slug: 'ai-task-manager',
        description: 'Smart task management app with AI-powered prioritization.',
        content: '# AI Task Manager\n\nManage your tasks efficiently with the help of AI...',
        image_url: 'https://picsum.photos/seed/ai/800/600',
        github_url: 'https://github.com',
        live_url: 'https://example.com',
        technologies: ['TypeScript', 'Python', 'OpenAI', 'Next.js'],
        is_featured: true
      },
      {
        title: 'Weather Dashboard',
        slug: 'weather-dashboard',
        description: 'Real-time weather tracking with interactive maps.',
        content: '# Weather Dashboard\n\nStay updated with the latest weather conditions...',
        image_url: 'https://picsum.photos/seed/weather/800/600',
        github_url: 'https://github.com',
        live_url: 'https://example.com',
        technologies: ['React', 'D3.js', 'OpenWeatherMap API'],
        is_featured: false
      }
    ];

    for (const project of fakeProjects) {
      await projectRepository.create(project);
    }
    console.log('Fake projects seeded.');
  }

  // Seed Blog Posts if none exist
  const blogRepository = new SQLiteBlogRepository();
  const { posts: existingPosts } = await blogRepository.findAll(1, 1);
  if (existingPosts.length === 0) {
    const fakePosts = [
      {
        title: 'The Future of Web Development',
        slug: 'future-of-web-dev',
        excerpt: 'Exploring the upcoming trends in the web ecosystem for 2026.',
        content: '# The Future of Web Development\n\nWeb development is evolving faster than ever...',
        cover_image: 'https://picsum.photos/seed/web/1200/600',
        tags: ['Technology', 'Web', 'Future'],
        status: 'published' as const
      },
      {
        title: 'Mastering TypeScript in 2026',
        slug: 'mastering-typescript',
        excerpt: 'Deep dive into advanced TypeScript patterns and features.',
        content: '# Mastering TypeScript\n\nTypeScript has become the industry standard...',
        cover_image: 'https://picsum.photos/seed/ts/1200/600',
        tags: ['TypeScript', 'Programming', 'Guide'],
        status: 'published' as const
      },
      {
        title: 'Building Scalable APIs',
        slug: 'scalable-apis',
        excerpt: 'Best practices for designing and implementing robust backend services.',
        content: '# Building Scalable APIs\n\nScalability is a core requirement for modern applications...',
        cover_image: 'https://picsum.photos/seed/api/1200/600',
        tags: ['Backend', 'Architecture', 'API'],
        status: 'published' as const
      }
    ];

    for (const post of fakePosts) {
      await blogRepository.create(post);
    }
    console.log('Fake blog posts seeded.');
  }

  const app = express();
  const PORT = 3000;

  // Trust proxy for express-rate-limit
  app.set('trust proxy', 1);

  // Security Middlewares
  app.use(helmet({
    contentSecurityPolicy: false, // Disable for development/Vite
  }));
  app.use(cookieParser());
  app.use(express.json());

  // --- API Routes ---
  app.use('/api/auth', authRouter);
  
  // Public routes (routers handle internal protection for mutations)
  app.use('/api/projects', projectsRouter);
  app.use('/api/blog', blogRouter);
  app.use('/api/about', aboutRouter);
  app.use('/api/contact', contactRouter);
  app.use('/api/upload', uploadRouter);

  // Serve static uploads
  app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

  // Specific protection for contact management (reading messages)
  // Note: contactRouter handles POST / publicly, but we can add extra protection here if needed
  // or better, handle it inside the router.


  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // --- Vite Middleware for Development ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});


