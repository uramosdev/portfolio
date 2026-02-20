import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from auth import get_password_hash
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Mock data for seeding
mock_blog_posts = [
    {
        "title": "Introducción a React Hooks y sus Ventajas",
        "excerpt": "Descubre cómo los Hooks de React han revolucionado la forma en que escribimos componentes funcionales y gestionamos el estado.",
        "content": "Los React Hooks han cambiado fundamentalmente la forma en que desarrollamos aplicaciones React. En este artículo, exploraremos useState, useEffect y otros hooks esenciales que hacen que el desarrollo sea más intuitivo y eficiente. Los hooks permiten usar estado y otras características de React sin escribir clases, lo que resulta en código más limpio y reutilizable.",
        "image": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
        "author": "Ubaldino Ramos",
        "date": datetime(2025, 7, 15),
        "category": "React",
        "readTime": "5 min",
        "tags": ["React", "JavaScript", "Frontend"]
    },
    {
        "title": "Mejores Prácticas para APIs RESTful",
        "excerpt": "Aprende a diseñar APIs RESTful robustas y escalables siguiendo las mejores prácticas de la industria.",
        "content": "El diseño de APIs es crucial para el éxito de cualquier aplicación moderna. En este post, cubriremos convenciones de nomenclatura, códigos de estado HTTP apropiados, versionado de APIs, y cómo estructurar endpoints de manera lógica. También exploraremos patrones de autenticación y autorización que mantienen tus APIs seguras.",
        "image": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
        "author": "Ubaldino Ramos",
        "date": datetime(2025, 7, 10),
        "category": "Backend",
        "readTime": "8 min",
        "tags": ["API", "Backend", "Node.js"]
    },
    {
        "title": "Optimización de Rendimiento en Aplicaciones Web",
        "excerpt": "Técnicas y estrategias para mejorar el rendimiento de tus aplicaciones web y ofrecer una experiencia de usuario excepcional.",
        "content": "El rendimiento es clave para la experiencia del usuario. Exploraremos lazy loading, code splitting, optimización de imágenes, compresión de assets, y caching estratégico. También veremos cómo usar herramientas como Lighthouse y Chrome DevTools para identificar cuellos de botella.",
        "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
        "author": "Ubaldino Ramos",
        "date": datetime(2025, 7, 5),
        "category": "Performance",
        "readTime": "10 min",
        "tags": ["Performance", "Optimization", "Web"]
    },
    {
        "title": "MongoDB vs PostgreSQL: ¿Cuál Elegir?",
        "excerpt": "Comparativa detallada entre bases de datos NoSQL y SQL para ayudarte a tomar la mejor decisión para tu proyecto.",
        "content": "La elección de la base de datos es fundamental. Analizaremos casos de uso, ventajas y desventajas de MongoDB y PostgreSQL. Discutiremos cuándo usar documentos vs relaciones, escalabilidad horizontal vs vertical, y consideraciones de consistencia.",
        "image": "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop",
        "author": "Ubaldino Ramos",
        "date": datetime(2025, 6, 28),
        "category": "Database",
        "readTime": "7 min",
        "tags": ["MongoDB", "PostgreSQL", "Database"]
    }
]

mock_projects = [
    {
        "title": "E-commerce Platform",
        "description": "Plataforma de comercio electrónico completa con carrito de compras, pasarela de pago y panel de administración.",
        "image": "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop",
        "technologies": ["React", "Node.js", "MongoDB", "Stripe"],
        "liveUrl": "https://example.com",
        "githubUrl": "https://github.com/example",
        "category": "web"
    },
    {
        "title": "Dashboard Analytics",
        "description": "Dashboard interactivo para visualización de datos en tiempo real con gráficos y métricas personalizables.",
        "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
        "technologies": ["React", "D3.js", "FastAPI", "PostgreSQL"],
        "liveUrl": "https://example.com",
        "githubUrl": "https://github.com/example",
        "category": "web"
    },
    {
        "title": "Task Management App",
        "description": "Aplicación de gestión de tareas con colaboración en equipo, notificaciones y seguimiento de proyectos.",
        "image": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
        "technologies": ["React", "Express", "MySQL", "Socket.io"],
        "liveUrl": "https://example.com",
        "githubUrl": "https://github.com/example",
        "category": "web"
    },
    {
        "title": "Restaurant Booking System",
        "description": "Sistema de reservas para restaurantes con gestión de mesas, calendario y confirmaciones automáticas.",
        "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
        "technologies": ["React", "Node.js", "MongoDB"],
        "liveUrl": "https://example.com",
        "githubUrl": "https://github.com/example",
        "category": "web"
    },
    {
        "title": "Portfolio CMS",
        "description": "Sistema de gestión de contenido especializado para portafolios creativos con galería multimedia.",
        "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
        "technologies": ["React", "FastAPI", "MongoDB"],
        "liveUrl": "https://example.com",
        "githubUrl": "https://github.com/example",
        "category": "web"
    },
    {
        "title": "Real Estate Platform",
        "description": "Plataforma inmobiliaria con búsqueda avanzada, filtros, mapas interactivos y gestión de propiedades.",
        "image": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
        "technologies": ["React", "Node.js", "PostgreSQL", "Maps API"],
        "liveUrl": "https://example.com",
        "githubUrl": "https://github.com/example",
        "category": "web"
    }
]


async def seed_database():
    """Seed the database with initial data"""
    mongo_url = os.environ['MONGO_URL']
    db_name = os.environ['DB_NAME']
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print("🌱 Starting database seeding...")
    
    # Clear existing data
    await db.blog_posts.delete_many({})
    await db.projects.delete_many({})
    await db.users.delete_many({})
    print("✅ Cleared existing data")
    
    # Seed admin user
    admin_user = {
        "username": os.getenv("ADMIN_USERNAME", "admin"),
        "password": get_password_hash(os.getenv("ADMIN_PASSWORD", "admin123")),
        "role": "admin",
        "createdAt": datetime.utcnow()
    }
    await db.users.insert_one(admin_user)
    print(f"✅ Created admin user: {admin_user['username']}")
    
    # Seed blog posts
    await db.blog_posts.insert_many(mock_blog_posts)
    print(f"✅ Seeded {len(mock_blog_posts)} blog posts")
    
    # Seed projects
    await db.projects.insert_many(mock_projects)
    print(f"✅ Seeded {len(mock_projects)} projects")
    
    print("\n🎉 Database seeding completed!")
    print(f"\nAdmin credentials:")
    print(f"Username: {admin_user['username']}")
    print(f"Password: {os.getenv('ADMIN_PASSWORD', 'admin123')}")
    
    client.close()


if __name__ == "__main__":
    asyncio.run(seed_database())