# Portfolio Personal - PRD

## Problema Original
Crear un sitio web de portfolio personal con blog para Ubaldino Ramos, desarrollador web. Incluye secciones: Home, About, Projects, Blog, Contact y panel Admin privado.

## Arquitectura
- **Frontend**: React + TailwindCSS + Framer Motion
- **Backend**: FastAPI + MongoDB
- **Auth**: JWT para panel admin

## Estructura
```
/app
├── backend/ (FastAPI, MongoDB)
│   ├── server.py, auth.py, models.py
└── frontend/ (React)
    └── src/components/ (Home, About, Projects, Blog, Contact, Admin, Sidebar)
```

## Credenciales Admin
- URL: `/admin-unchain`
- Usuario: `lordCi4`
- Contraseña: `morningStar`

## Features Completadas
- [x] Full-stack app funcional
- [x] Panel admin seguro con URL secreta
- [x] Animaciones de transición (Framer Motion)
- [x] Sidebar colapsable en desktop
- [x] Diseño responsive móvil/desktop
- [x] Sidebar cerrado por defecto al iniciar (Dic 2025)

## Pendiente
- Ninguna tarea pendiente actualmente

## Notas
- El usuario prefiere comunicación en **español**
