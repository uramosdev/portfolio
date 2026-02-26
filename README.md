# Portfolio Full-Stack (React + Express + SQLite)

A modern, high-performance portfolio built with React, Express, and SQLite. Features a custom admin dashboard, blog, project showcase, and a real-time contact form with email notifications.

## 🚀 Quick Start (Local)

### 1. Prerequisites
- Node.js (v18 or higher)
- npm

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Copy the example environment file and fill in your details:
```bash
cp .env.example .env
```
Edit `.env` and set:
- `JWT_SECRET`: A random string for security.
- `ADMIN_EMAIL`: Your login email.
- `ADMIN_PASSWORD`: Your login password.
- `RESEND_API_KEY`: (Optional) Get one at [resend.com](https://resend.com) for contact form emails.

### 4. Run Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

---

## 🚂 Deployment to Railway

This project is optimized for [Railway.app](https://railway.app).

### 1. Create a New Project
- Connect your GitHub repository to Railway.
- Select "Empty Project" or "Deploy from Repo".

### 2. Configure Variables
In the Railway dashboard, go to **Variables** and add:
- `JWT_SECRET`: (Required)
- `JWT_REFRESH_SECRET`: (Required)
- `ADMIN_EMAIL`: (Required)
- `ADMIN_PASSWORD`: (Required)
- `RESEND_API_KEY`: (Optional, for emails)
- `NODE_ENV`: `production`

### 3. Persistent Storage (SQLite)
Since SQLite uses a local file, you need to ensure the data persists across deployments:
1. Go to your service settings in Railway.
2. Add a **Volume** (e.g., 1GB).
3. Mount the volume to the path where the database resides: `/app/src/server/infrastructure/` (or wherever your `database.sqlite` is generated).
   *Note: In this specific architecture, the DB is initialized in `src/server/infrastructure/database.sqlite`.*

### 4. Build & Start
Railway will automatically detect the `package.json` and run:
- **Build**: `npm run build`
- **Start**: `npm start`

---

## 🛠 Tech Stack
- **Frontend**: React 18, Tailwind CSS, Motion (Framer), Lucide Icons.
- **Backend**: Node.js, Express, `better-sqlite3`.
- **Authentication**: JWT (JSON Web Tokens) with HttpOnly Cookies.
- **Email**: Resend API.

## 📁 Project Structure
- `/src/server`: Express API and SQLite logic.
- `/src/features`: Modular React components (About, Projects, Blog, Admin).
- `/src/store`: State management with Zustand.
