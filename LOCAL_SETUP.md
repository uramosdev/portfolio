# Guía Completa para Ejecutar el Portfolio Localmente

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** v18+ → [Descargar](https://nodejs.org/)
- **Python** 3.11+ → [Descargar](https://www.python.org/downloads/)
- **MongoDB** → [Descargar](https://www.mongodb.com/try/download/community) o usar [MongoDB Atlas](https://www.mongodb.com/atlas) (gratis)
- **Yarn** (gestor de paquetes) → `npm install -g yarn`
- **Git** → [Descargar](https://git-scm.com/)

---

## Paso 1: Descargar el Proyecto

```bash
# Clonar el repositorio (reemplaza con tu URL)
git clone https://github.com/tu-usuario/portfolio.git
cd portfolio
```

---

## Paso 2: Configurar MongoDB

### Opción A: MongoDB Local (Recomendado para desarrollo)

1. **Instalar MongoDB Community Server:**
   - Windows: Descarga el instalador MSI desde [mongodb.com](https://www.mongodb.com/try/download/community)
   - Mac: `brew install mongodb-community`
   - Linux (Ubuntu): 
     ```bash
     sudo apt-get install gnupg curl
     curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
     echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
     sudo apt-get update
     sudo apt-get install -y mongodb-org
     ```

2. **Iniciar MongoDB:**
   - Windows: Se inicia automáticamente como servicio
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

3. **Verificar que funciona:**
   ```bash
   mongosh
   # Deberías ver la consola de MongoDB
   # Escribe 'exit' para salir
   ```

### Opción B: MongoDB Atlas (Cloud - Gratis)

1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crea un cluster gratuito (M0)
3. En "Database Access", crea un usuario con contraseña
4. En "Network Access", añade tu IP o `0.0.0.0/0` (permite todas)
5. En "Connect", selecciona "Connect your application" y copia la URL de conexión
6. La URL se verá así: `mongodb+srv://usuario:contraseña@cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority`

---

## Paso 3: Configurar el Backend

```bash
# Ir a la carpeta del backend
cd backend

# Crear entorno virtual de Python
python -m venv venv

# Activar el entorno virtual
# En Windows:
venv\Scripts\activate
# En Mac/Linux:
source venv/bin/activate

# Instalar dependencias
pip install fastapi uvicorn motor pymongo python-jose passlib bcrypt python-multipart python-dotenv pydantic email-validator
```

### Crear archivo `.env` en `/backend/`:

```bash
# Crear archivo .env
# En Windows (PowerShell):
New-Item -Path .env -ItemType File

# En Mac/Linux:
touch .env
```

**Contenido del archivo `backend/.env`:**

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=portfolio_db
JWT_SECRET=mi-clave-secreta-super-segura-cambiar-en-produccion-2025
ADMIN_USERNAME=lordCi4
ADMIN_PASSWORD=morningStar
CORS_ORIGINS=http://localhost:3000
```

> **Nota:** Si usas MongoDB Atlas, reemplaza `MONGO_URL` con tu URL de conexión de Atlas.

### Crear el usuario admin:

```bash
# Desde la carpeta backend, con el entorno virtual activado
python seed.py
```

### Iniciar el servidor backend:

```bash
# Desde la carpeta backend
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

Deberías ver:
```
INFO:     Uvicorn running on http://0.0.0.0:8001 (Press CTRL+C to quit)
INFO:     Started reloader process
```

**Verificar que funciona:** Abre http://localhost:8001/docs en tu navegador.

---

## Paso 4: Configurar el Frontend

Abre una **nueva terminal** (deja el backend corriendo):

```bash
# Ir a la carpeta del frontend
cd frontend

# Instalar dependencias
yarn install
```

### Crear archivo `.env` en `/frontend/`:

**Contenido del archivo `frontend/.env`:**

```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

### Iniciar el servidor frontend:

```bash
yarn start
```

Deberías ver:
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
```

---

## Paso 5: Abrir la Aplicación

- **Portfolio:** http://localhost:3000
- **Panel Admin:** http://localhost:3000/admin-unchain
  - Usuario: `lordCi4`
  - Contraseña: `morningStar`
- **API Docs:** http://localhost:8001/docs

---

## Estructura de Archivos Requeridos

```
portfolio/
├── backend/
│   ├── .env                 ← Crear este archivo
│   ├── server.py
│   ├── models.py
│   ├── auth.py
│   ├── seed.py
│   └── requirements.txt
│
└── frontend/
    ├── .env                 ← Crear este archivo
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── services/
    │   ├── App.js
    │   └── index.css
    └── package.json
```

---

## Comandos Útiles

### Backend
```bash
# Activar entorno virtual
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows

# Iniciar servidor
uvicorn server:app --reload --host 0.0.0.0 --port 8001

# Recrear usuario admin
python seed.py
```

### Frontend
```bash
# Instalar dependencias
yarn install

# Iniciar en desarrollo
yarn start

# Crear build de producción
yarn build
```

### MongoDB
```bash
# Iniciar MongoDB (Linux)
sudo systemctl start mongod

# Iniciar MongoDB (Mac)
brew services start mongodb-community

# Verificar estado
mongosh
```

---

## Solución de Problemas Comunes

### Error: "MongoDB connection failed"
- Verifica que MongoDB esté corriendo
- Verifica que la URL en `backend/.env` sea correcta
- Si usas Atlas, verifica que tu IP esté en la whitelist

### Error: "CORS policy"
- Verifica que `CORS_ORIGINS` en `backend/.env` incluya `http://localhost:3000`

### Error: "Module not found"
```bash
# Backend - reinstalar dependencias
pip install -r requirements.txt

# Frontend - reinstalar dependencias
yarn install
```

### Error: "Port 3000/8001 already in use"
```bash
# Encontrar y matar el proceso
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :3000
kill -9 <PID>
```

### El admin no funciona
```bash
# Recrear usuario admin
cd backend
python seed.py
```

---

## Personalización

### Cambiar credenciales de admin

1. Edita `backend/.env`:
   ```env
   ADMIN_USERNAME=tu_nuevo_usuario
   ADMIN_PASSWORD=tu_nueva_contraseña
   ```

2. Ejecuta:
   ```bash
   cd backend
   python seed.py
   ```

### Cambiar URL del admin

1. Abre `frontend/src/App.js`
2. Busca `admin-unchain` y reemplázalo por tu URL preferida
3. Guarda y reinicia el frontend

### Cambiar información personal

Edita `frontend/src/components/Home.jsx` y otros componentes para cambiar:
- Nombre
- Título profesional
- Descripción
- Redes sociales

---

## Script de Inicio Rápido

Crea un archivo `start.sh` (Mac/Linux) o `start.bat` (Windows) en la raíz del proyecto:

### Mac/Linux (`start.sh`):
```bash
#!/bin/bash

# Iniciar MongoDB (si es local)
# sudo systemctl start mongod

# Terminal 1: Backend
cd backend
source venv/bin/activate
uvicorn server:app --reload --host 0.0.0.0 --port 8001 &

# Terminal 2: Frontend
cd ../frontend
yarn start
```

### Windows (`start.bat`):
```batch
@echo off

:: Iniciar Backend
start cmd /k "cd backend && venv\Scripts\activate && uvicorn server:app --reload --host 0.0.0.0 --port 8001"

:: Esperar 3 segundos
timeout /t 3

:: Iniciar Frontend
start cmd /k "cd frontend && yarn start"
```

---

## ¿Necesitas Ayuda?

- Revisa la documentación de [FastAPI](https://fastapi.tiangolo.com/)
- Revisa la documentación de [React](https://react.dev/)
- Revisa la documentación de [MongoDB](https://docs.mongodb.com/)

---

¡Listo! Tu portfolio debería estar funcionando en http://localhost:3000
