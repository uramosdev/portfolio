# API Contracts & Backend Integration Plan

## 1. Datos Actualmente Mockeados (mockData.js)

### 1.1 Personal Info (estático - NO necesita backend)
- Información personal del portfolio (nombre, email, teléfono, bio, redes sociales)
- Se mantendrá en el código frontend como constantes

### 1.2 Services (estático - NO necesita backend)
- Lista de servicios ofrecidos
- Se mantendrá en el código frontend

### 1.3 Blog Posts (DINÁMICO - necesita backend)
```javascript
{
  id: number,
  title: string,
  excerpt: string,
  content: string,
  image: string (URL),
  author: string,
  date: string (ISO),
  category: string,
  readTime: string,
  tags: string[]
}
```

### 1.4 Projects (DINÁMICO - necesita backend)
```javascript
{
  id: number,
  title: string,
  description: string,
  image: string (URL),
  technologies: string[],
  liveUrl: string,
  githubUrl: string,
  category: string
}
```

### 1.5 Contact Form (DINÁMICO - necesita backend)
```javascript
{
  name: string,
  email: string,
  subject: string,
  message: string,
  date: string (ISO)
}
```

---

## 2. MongoDB Models

### 2.1 BlogPost Model
```python
{
  "_id": ObjectId,
  "title": str,
  "excerpt": str,
  "content": str,
  "image": str,
  "author": str,
  "date": datetime,
  "category": str,
  "readTime": str,
  "tags": List[str],
  "createdAt": datetime,
  "updatedAt": datetime
}
```

### 2.2 Project Model
```python
{
  "_id": ObjectId,
  "title": str,
  "description": str,
  "image": str,
  "technologies": List[str],
  "liveUrl": str,
  "githubUrl": str,
  "category": str,
  "createdAt": datetime,
  "updatedAt": datetime
}
```

### 2.3 ContactMessage Model
```python
{
  "_id": ObjectId,
  "name": str,
  "email": str,
  "subject": str,
  "message": str,
  "date": datetime,
  "read": bool (default: False)
}
```

### 2.4 User Model (Admin)
```python
{
  "_id": ObjectId,
  "username": str (unique),
  "password": str (hashed),
  "role": str (default: "admin"),
  "createdAt": datetime
}
```

---

## 3. API Endpoints

### 3.1 Blog Posts
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/blog/posts | No | Obtener todos los posts |
| GET | /api/blog/posts/:id | No | Obtener un post por ID |
| POST | /api/blog/posts | Sí | Crear nuevo post |
| PUT | /api/blog/posts/:id | Sí | Actualizar post |
| DELETE | /api/blog/posts/:id | Sí | Eliminar post |

**Request Body (POST/PUT):**
```json
{
  "title": "string",
  "excerpt": "string",
  "content": "string",
  "image": "string",
  "category": "string",
  "tags": ["string"],
  "readTime": "string"
}
```

**Response (GET):**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "title": "string",
      "excerpt": "string",
      "content": "string",
      "image": "string",
      "author": "string",
      "date": "ISO date string",
      "category": "string",
      "readTime": "string",
      "tags": ["string"]
    }
  ]
}
```

### 3.2 Projects
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/projects | No | Obtener todos los proyectos |
| GET | /api/projects/:id | No | Obtener un proyecto |
| POST | /api/projects | Sí | Crear nuevo proyecto |
| PUT | /api/projects/:id | Sí | Actualizar proyecto |
| DELETE | /api/projects/:id | Sí | Eliminar proyecto |

**Request Body (POST/PUT):**
```json
{
  "title": "string",
  "description": "string",
  "image": "string",
  "technologies": ["string"],
  "liveUrl": "string",
  "githubUrl": "string",
  "category": "string"
}
```

### 3.3 Contact
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/contact | No | Enviar mensaje |
| GET | /api/contact/messages | Sí | Obtener todos los mensajes |
| DELETE | /api/contact/messages/:id | Sí | Eliminar mensaje |

**Request Body (POST):**
```json
{
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "string"
}
```

### 3.4 Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/login | No | Login admin |
| POST | /api/auth/logout | Sí | Logout |
| GET | /api/auth/verify | Sí | Verificar sesión |

**Request Body (POST /api/auth/login):**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "token": "JWT token",
  "user": {
    "username": "string",
    "role": "string"
  }
}
```

---

## 4. Frontend Integration

### 4.1 Archivos a Crear
- `/app/frontend/src/context/AuthContext.jsx` - Context para autenticación
- `/app/frontend/src/services/api.js` - Funciones para llamadas API
- `/app/frontend/src/services/blogService.js` - Servicio para blog
- `/app/frontend/src/services/projectService.js` - Servicio para proyectos
- `/app/frontend/src/services/contactService.js` - Servicio para contacto
- `/app/frontend/src/services/authService.js` - Servicio para auth

### 4.2 Componentes a Modificar
1. **App.js**: Envolver con AuthProvider
2. **Admin.jsx**: 
   - Usar AuthContext para login real
   - Llamar API para CRUD de posts
   - Mostrar mensajes de contacto
3. **Blog.jsx**: 
   - Fetch posts desde API en useEffect
   - Manejar loading y errores
4. **Projects.jsx**: 
   - Fetch proyectos desde API
5. **Contact.jsx**: 
   - Enviar formulario a API
   - Mostrar confirmación real

### 4.3 Cambios en mockData.js
- Mantener personalInfo y services (estáticos)
- Eliminar blogPosts, projects (se obtendrán de API)
- Usar como fallback en caso de error de API

---

## 5. Authentication Flow

1. Usuario ingresa username/password en Admin
2. Frontend envía POST a /api/auth/login
3. Backend valida credenciales
4. Backend genera JWT token
5. Frontend almacena token en localStorage
6. Frontend incluye token en header de requests protegidos: `Authorization: Bearer <token>`
7. Backend middleware valida token en rutas protegidas
8. Logout elimina token del localStorage

---

## 6. Error Handling

### Backend
- Validación de datos con Pydantic
- Try-catch en todas las operaciones DB
- Responses consistentes:
```json
{
  "success": false,
  "error": "Mensaje de error descriptivo"
}
```

### Frontend
- Try-catch en todas las llamadas API
- Estados de loading
- Mensajes de error amigables
- Fallback a mock data si API falla

---

## 7. Seeders (Datos Iniciales)

Crear script para poblar DB con:
1. Usuario admin por defecto (username: admin, password: admin123)
2. Posts del blog desde mockData
3. Proyectos desde mockData

---

## 8. Testing Checklist

### Backend
- [ ] Crear post sin autenticación (debe fallar)
- [ ] Login con credenciales incorrectas
- [ ] Login exitoso y obtener token
- [ ] Crear post con token válido
- [ ] Actualizar post
- [ ] Eliminar post
- [ ] Obtener todos los posts (sin auth)
- [ ] Enviar mensaje de contacto
- [ ] Obtener mensajes (con auth)

### Frontend
- [ ] Cargar blog posts desde API
- [ ] Cargar proyectos desde API
- [ ] Login en admin panel
- [ ] Crear nuevo post desde admin
- [ ] Editar post existente
- [ ] Eliminar post
- [ ] Enviar formulario de contacto
- [ ] Verificar mensaje de éxito
- [ ] Logout

---

## 9. Deployment Considerations

### Environment Variables
Backend (.env):
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=portfolio_db
JWT_SECRET=your-secret-key-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

Frontend (.env):
```
REACT_APP_BACKEND_URL=http://localhost:8001 (local)
REACT_APP_BACKEND_URL=https://your-domain.com (production)
```

### Production Checklist
- [ ] Cambiar JWT_SECRET a valor seguro
- [ ] Cambiar ADMIN_PASSWORD
- [ ] Configurar CORS correctamente
- [ ] Habilitar HTTPS
- [ ] Configurar rate limiting
- [ ] Backups de MongoDB
