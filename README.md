# 🚀 Portafolio Personal - Ubaldino Ramos

Portafolio web profesional con blog integrado, construido con React, FastAPI y MongoDB. Diseño moderno dark theme con acento verde menta, optimizado para desarrolladores web.

![Portfolio Preview](https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop)

## ✨ Características

- 🎨 **Diseño Moderno**: Dark theme con acento verde menta (#4ade80)
- 📱 **Responsive**: Adaptado para móviles, tablets y desktop
- 🔐 **Panel Admin**: Gestión completa de blog y mensajes de contacto
- 📝 **Blog Dinámico**: Crear, editar y eliminar posts con rich content
- 💼 **Portafolio de Proyectos**: Showcase de tus mejores trabajos
- 📬 **Formulario de Contacto**: Los mensajes se guardan en la base de datos
- 🔒 **Autenticación JWT**: Seguridad para el panel de administración
- ⚡ **API RESTful**: Backend robusto con FastAPI
- 🗄️ **MongoDB**: Base de datos NoSQL para flexibilidad

## 📁 Estructura del Proyecto

```
/app
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes de React
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Blog.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── Admin.jsx
│   │   ├── context/         # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── services/        # Servicios API
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── blogService.js
│   │   │   ├── projectService.js
│   │   │   └── contactService.js
│   │   ├── mock/            # Datos mock para desarrollo
│   │   │   └── mockData.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   └── .env
│
├── backend/                  # API FastAPI
│   ├── server.py            # Servidor principal
│   ├── models.py            # Modelos Pydantic
│   ├── auth.py              # Autenticación JWT
│   ├── seed.py              # Script para poblar DB
│   ├── requirements.txt
│   └── .env
│
└── contracts.md             # Documentación de API contracts
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19** - Biblioteca UI
- **React Router v7** - Navegación
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos modernos
- **Tailwind CSS** - Estilos utility-first
- **shadcn/ui** - Componentes UI

### Backend
- **FastAPI** - Framework web moderno
- **Motor** - Driver async de MongoDB
- **PyJWT** - JSON Web Tokens
- **Passlib + Bcrypt** - Hashing de contraseñas
- **Pydantic** - Validación de datos

### Base de Datos
- **MongoDB** - Base de datos NoSQL

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 16+ y Yarn
- Python 3.11+
- MongoDB (local o Atlas)

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/tu-portfolio.git
cd tu-portfolio
```

### 2. Configurar Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
# Crear archivo .env con:
MONGO_URL=mongodb://localhost:27017
DB_NAME=portfolio_db
JWT_SECRET=tu-clave-secreta-aqui-cambiala-en-produccion
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Poblar la base de datos con datos iniciales
python seed.py

# Iniciar el servidor (desarrollo)
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

### 3. Configurar Frontend

```bash
cd frontend

# Instalar dependencias
yarn install

# Configurar variables de entorno
# Crear archivo .env con:
REACT_APP_BACKEND_URL=http://localhost:8001

# Iniciar el servidor de desarrollo
yarn start
```

La aplicación estará disponible en:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **API Docs**: http://localhost:8001/docs

## 📝 Configuración Inicial

### 1. Personalizar Información Personal

Edita `/frontend/src/mock/mockData.js`:

```javascript
export const personalInfo = {
  name: "Tu Nombre",
  title: "Tu Profesión",
  location: "Tu Ciudad",
  age: "Tu Edad",
  status: "Freelance/Full-time",
  email: "tu@email.com",
  phone: "+1 234 567 890",
  bio: "Tu biografía...",
  profileImage: "URL de tu foto",
  socialLinks: {
    github: "https://github.com/tu-usuario",
    linkedin: "https://linkedin.com/in/tu-perfil",
    twitter: "https://twitter.com/tu-usuario",
    behance: "https://behance.net/tu-perfil"
  }
};
```

### 2. Cambiar Credenciales de Admin

En producción, **CAMBIA** las credenciales por defecto:

```bash
# En backend/.env
ADMIN_USERNAME=tu-nuevo-usuario
ADMIN_PASSWORD=una-contraseña-segura
JWT_SECRET=una-clave-jwt-muy-segura-y-aleatoria
```

Luego ejecuta `python seed.py` nuevamente para crear el nuevo usuario.

## 🔐 Uso del Panel Admin

### Acceso Seguro

**URL secreta del panel admin:**
```
http://localhost:3000/admin-panel-ubaldino-2025
```
(En producción: `https://tu-dominio.com/admin-panel-ubaldino-2025`)

⚠️ **Importante:** El botón de Admin está oculto del sidebar público por seguridad. Solo tú conoces esta URL.

### Pasos para acceder:

1. Escribe la URL secreta directamente en tu navegador
2. Inicia sesión con tus credenciales (por defecto: admin/admin123)
3. Gestiona tus posts del blog:
   - ✅ Crear nuevos posts
   - ✏️ Editar posts existentes
   - 🗑️ Eliminar posts
4. Revisa mensajes de contacto:
   - 📬 Ver todos los mensajes recibidos
   - 🗑️ Eliminar mensajes leídos

### Personalizar la URL secreta

Para cambiar la URL a algo aún más personal:

1. Abre `/app/frontend/src/App.js`
2. Busca `admin-panel-ubaldino-2025`
3. Cámbiala por tu URL preferida (ejemplo: `mi-super-admin-xyz`)
4. Actualiza en 2 lugares:
   - En el `case` del switch
   - En el `useEffect` que sincroniza la ruta

## 📡 API Endpoints

### Autenticación
```
POST   /api/auth/login      - Iniciar sesión
GET    /api/auth/verify     - Verificar token
```

### Blog Posts
```
GET    /api/blog/posts           - Obtener todos los posts
GET    /api/blog/posts/:id       - Obtener un post
POST   /api/blog/posts           - Crear post (requiere auth)
PUT    /api/blog/posts/:id       - Actualizar post (requiere auth)
DELETE /api/blog/posts/:id       - Eliminar post (requiere auth)
```

### Proyectos
```
GET    /api/projects             - Obtener todos los proyectos
GET    /api/projects/:id         - Obtener un proyecto
POST   /api/projects             - Crear proyecto (requiere auth)
PUT    /api/projects/:id         - Actualizar proyecto (requiere auth)
DELETE /api/projects/:id         - Eliminar proyecto (requiere auth)
```

### Contacto
```
POST   /api/contact              - Enviar mensaje
GET    /api/contact/messages     - Obtener mensajes (requiere auth)
DELETE /api/contact/messages/:id - Eliminar mensaje (requiere auth)
```

## 🌐 Despliegue

### Opción 1: Despliegue en Emergent (Actual)

El proyecto ya está configurado para Emergent con supervisor. Los servicios se reinician automáticamente:

```bash
# Reiniciar servicios
sudo supervisorctl restart frontend
sudo supervisorctl restart backend
sudo supervisorctl restart all

# Ver logs
tail -f /var/log/supervisor/frontend.*.log
tail -f /var/log/supervisor/backend.*.log
```

### Opción 2: Vercel (Frontend) + Railway/Render (Backend)

#### Frontend en Vercel:
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desde /frontend
vercel

# Configurar variables de entorno en Vercel:
# REACT_APP_BACKEND_URL=https://tu-backend-url.com
```

#### Backend en Railway/Render:
1. Conecta tu repositorio
2. Configura las variables de entorno
3. Railway/Render detectará automáticamente FastAPI

### Opción 3: Docker

Crear `Dockerfile` para backend:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"]
```

Crear `Dockerfile` para frontend:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build
CMD ["yarn", "start"]
```

Usar `docker-compose.yml`:
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8001:8001"
    environment:
      - MONGO_URL=mongodb://mongo:27017
      - DB_NAME=portfolio_db
    depends_on:
      - mongo
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_BACKEND_URL=http://localhost:8001
  
  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

Ejecutar:
```bash
docker-compose up -d
```

## 🔧 Desarrollo

### Agregar Nuevos Proyectos

Opción 1: Desde el código (temporal):
```javascript
// En /frontend/src/mock/mockData.js
export const projects = [
  ...proyectos existentes,
  {
    id: 7,
    title: "Nuevo Proyecto",
    description: "Descripción...",
    image: "URL de imagen",
    technologies: ["React", "Node.js"],
    liveUrl: "https://proyecto.com",
    githubUrl: "https://github.com/usuario/proyecto",
    category: "web"
  }
];
```

Opción 2: Desde la API (recomendado):
```bash
curl -X POST http://localhost:8001/api/projects \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nuevo Proyecto",
    "description": "Descripción...",
    "image": "URL",
    "technologies": ["React", "Node.js"],
    "liveUrl": "https://proyecto.com",
    "githubUrl": "https://github.com/usuario/proyecto",
    "category": "web"
  }'
```

### Personalizar Colores

Edita `/frontend/src/index.css`:
```css
:root {
  /* Cambiar color de acento */
  --emerald-500: #4ade80;  /* Verde menta actual */
  /* O usa otro color, por ejemplo: */
  --emerald-500: #3b82f6;  /* Azul */
}
```

### Cambiar Fuente

En `/frontend/src/App.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=TU_FUENTE:wght@400;500;600;700;800;900&display=swap');

* {
    font-family: 'TU_FUENTE', sans-serif;
}
```

## 🐛 Solución de Problemas

### Backend no inicia
```bash
# Verificar MongoDB
sudo systemctl status mongod

# Ver logs de backend
tail -f /var/log/supervisor/backend.err.log

# Reinstalar dependencias
pip install -r requirements.txt
```

### Frontend no conecta con Backend
```bash
# Verificar .env
cat /app/frontend/.env
# Debe mostrar: REACT_APP_BACKEND_URL=...

# Reiniciar frontend
sudo supervisorctl restart frontend
```

### Error de autenticación
```bash
# Recrear usuario admin
cd /app/backend
python seed.py
```

### MongoDB no conecta
```bash
# Verificar URL en backend/.env
echo $MONGO_URL

# Probar conexión
mongosh "mongodb://localhost:27017"
```

## 📚 Recursos Adicionales

- [Documentación de FastAPI](https://fastapi.tiangolo.com/)
- [Documentación de React](https://react.dev/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: nueva característica'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto. Siéntete libre de usarlo para tu portafolio personal.

## 👤 Autor

**Ubaldino Ramos**
- GitHub: [@ubaldinoramos](https://github.com/ubaldinoramos)
- LinkedIn: [ubaldino-ramos](https://linkedin.com/in/ubaldinoramos)

---

⭐ Si este proyecto te ha sido útil, ¡no olvides darle una estrella en GitHub!

## 🎨 Créditos de Diseño

- Iconos: [Lucide Icons](https://lucide.dev/)
- Imágenes: [Unsplash](https://unsplash.com/)
- Fuente: [Inter](https://fonts.google.com/specimen/Inter)

---

**¿Necesitas ayuda?** Abre un issue en GitHub o contáctame directamente.
