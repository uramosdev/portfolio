from fastapi import FastAPI, APIRouter, HTTPException, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List
from datetime import datetime
from bson import ObjectId

from models import (
    BlogPostCreate, BlogPostUpdate, BlogPostResponse,
    ProjectCreate, ProjectUpdate, ProjectResponse,
    ContactMessageCreate, ContactMessageResponse,
    UserLogin, TokenResponse, UserResponse
)
from auth import verify_password, create_access_token, verify_token

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Ubaldino Ramos Portfolio API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Helper function to convert MongoDB document to dict
def doc_to_dict(doc, id_field="id"):
    """Convert MongoDB document to dictionary with id field"""
    if doc:
        doc[id_field] = str(doc.pop("_id"))
        return doc
    return None


# ========== AUTH ENDPOINTS ==========

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    """Login endpoint for admin"""
    try:
        user = await db.users.find_one({"username": credentials.username})
        if not user or not verify_password(credentials.password, user["password"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        token = create_access_token(data={"sub": user["username"], "role": user["role"]})
        
        return {
            "success": True,
            "token": token,
            "user": {
                "username": user["username"],
                "role": user["role"]
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Login error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@api_router.get("/auth/verify")
async def verify_auth(token_data: dict = Depends(verify_token)):
    """Verify if token is valid"""
    return {"success": True, "username": token_data.get("sub")}


# ========== BLOG ENDPOINTS ==========

@api_router.get("/blog/posts", response_model=List[BlogPostResponse])
async def get_blog_posts():
    """Get all blog posts"""
    try:
        posts = await db.blog_posts.find().sort("date", -1).to_list(1000)
        return [
            {
                "id": str(post["_id"]),
                "title": post["title"],
                "excerpt": post["excerpt"],
                "content": post["content"],
                "image": post["image"],
                "author": post["author"],
                "date": post["date"].isoformat() if isinstance(post["date"], datetime) else post["date"],
                "category": post["category"],
                "readTime": post["readTime"],
                "tags": post["tags"]
            }
            for post in posts
        ]
    except Exception as e:
        logging.error(f"Error fetching blog posts: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching blog posts")


@api_router.get("/blog/posts/{post_id}", response_model=BlogPostResponse)
async def get_blog_post(post_id: str):
    """Get a single blog post by ID"""
    try:
        if not ObjectId.is_valid(post_id):
            raise HTTPException(status_code=400, detail="Invalid post ID")
        
        post = await db.blog_posts.find_one({"_id": ObjectId(post_id)})
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        
        return {
            "id": str(post["_id"]),
            "title": post["title"],
            "excerpt": post["excerpt"],
            "content": post["content"],
            "image": post["image"],
            "author": post["author"],
            "date": post["date"].isoformat() if isinstance(post["date"], datetime) else post["date"],
            "category": post["category"],
            "readTime": post["readTime"],
            "tags": post["tags"]
        }
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error fetching blog post: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching blog post")


@api_router.post("/blog/posts", response_model=BlogPostResponse)
async def create_blog_post(post: BlogPostCreate, token_data: dict = Depends(verify_token)):
    """Create a new blog post (requires authentication)"""
    try:
        post_dict = post.dict()
        post_dict["author"] = "Ubaldino Ramos"
        post_dict["date"] = datetime.utcnow()
        
        result = await db.blog_posts.insert_one(post_dict)
        created_post = await db.blog_posts.find_one({"_id": result.inserted_id})
        
        return {
            "id": str(created_post["_id"]),
            "title": created_post["title"],
            "excerpt": created_post["excerpt"],
            "content": created_post["content"],
            "image": created_post["image"],
            "author": created_post["author"],
            "date": created_post["date"].isoformat(),
            "category": created_post["category"],
            "readTime": created_post["readTime"],
            "tags": created_post["tags"]
        }
    except Exception as e:
        logging.error(f"Error creating blog post: {str(e)}")
        raise HTTPException(status_code=500, detail="Error creating blog post")


@api_router.put("/blog/posts/{post_id}", response_model=BlogPostResponse)
async def update_blog_post(
    post_id: str,
    post: BlogPostUpdate,
    token_data: dict = Depends(verify_token)
):
    """Update a blog post (requires authentication)"""
    try:
        if not ObjectId.is_valid(post_id):
            raise HTTPException(status_code=400, detail="Invalid post ID")
        
        update_data = {k: v for k, v in post.dict().items() if v is not None}
        if not update_data:
            raise HTTPException(status_code=400, detail="No data to update")
        
        result = await db.blog_posts.update_one(
            {"_id": ObjectId(post_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Post not found")
        
        updated_post = await db.blog_posts.find_one({"_id": ObjectId(post_id)})
        
        return {
            "id": str(updated_post["_id"]),
            "title": updated_post["title"],
            "excerpt": updated_post["excerpt"],
            "content": updated_post["content"],
            "image": updated_post["image"],
            "author": updated_post["author"],
            "date": updated_post["date"].isoformat() if isinstance(updated_post["date"], datetime) else updated_post["date"],
            "category": updated_post["category"],
            "readTime": updated_post["readTime"],
            "tags": updated_post["tags"]
        }
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error updating blog post: {str(e)}")
        raise HTTPException(status_code=500, detail="Error updating blog post")


@api_router.delete("/blog/posts/{post_id}")
async def delete_blog_post(post_id: str, token_data: dict = Depends(verify_token)):
    """Delete a blog post (requires authentication)"""
    try:
        if not ObjectId.is_valid(post_id):
            raise HTTPException(status_code=400, detail="Invalid post ID")
        
        result = await db.blog_posts.delete_one({"_id": ObjectId(post_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Post not found")
        
        return {"success": True, "message": "Post deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error deleting blog post: {str(e)}")
        raise HTTPException(status_code=500, detail="Error deleting blog post")


# ========== PROJECT ENDPOINTS ==========

@api_router.get("/projects", response_model=List[ProjectResponse])
async def get_projects():
    """Get all projects"""
    try:
        projects = await db.projects.find().to_list(1000)
        return [
            {
                "id": str(project["_id"]),
                "title": project["title"],
                "description": project["description"],
                "image": project["image"],
                "technologies": project["technologies"],
                "liveUrl": project["liveUrl"],
                "githubUrl": project["githubUrl"],
                "category": project["category"]
            }
            for project in projects
        ]
    except Exception as e:
        logging.error(f"Error fetching projects: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching projects")


@api_router.get("/projects/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: str):
    """Get a single project by ID"""
    try:
        if not ObjectId.is_valid(project_id):
            raise HTTPException(status_code=400, detail="Invalid project ID")
        
        project = await db.projects.find_one({"_id": ObjectId(project_id)})
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        return {
            "id": str(project["_id"]),
            "title": project["title"],
            "description": project["description"],
            "image": project["image"],
            "technologies": project["technologies"],
            "liveUrl": project["liveUrl"],
            "githubUrl": project["githubUrl"],
            "category": project["category"]
        }
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error fetching project: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching project")


@api_router.post("/projects", response_model=ProjectResponse)
async def create_project(project: ProjectCreate, token_data: dict = Depends(verify_token)):
    """Create a new project (requires authentication)"""
    try:
        project_dict = project.dict()
        result = await db.projects.insert_one(project_dict)
        created_project = await db.projects.find_one({"_id": result.inserted_id})
        
        return {
            "id": str(created_project["_id"]),
            "title": created_project["title"],
            "description": created_project["description"],
            "image": created_project["image"],
            "technologies": created_project["technologies"],
            "liveUrl": created_project["liveUrl"],
            "githubUrl": created_project["githubUrl"],
            "category": created_project["category"]
        }
    except Exception as e:
        logging.error(f"Error creating project: {str(e)}")
        raise HTTPException(status_code=500, detail="Error creating project")


@api_router.put("/projects/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    project: ProjectUpdate,
    token_data: dict = Depends(verify_token)
):
    """Update a project (requires authentication)"""
    try:
        if not ObjectId.is_valid(project_id):
            raise HTTPException(status_code=400, detail="Invalid project ID")
        
        update_data = {k: v for k, v in project.dict().items() if v is not None}
        if not update_data:
            raise HTTPException(status_code=400, detail="No data to update")
        
        result = await db.projects.update_one(
            {"_id": ObjectId(project_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Project not found")
        
        updated_project = await db.projects.find_one({"_id": ObjectId(project_id)})
        
        return {
            "id": str(updated_project["_id"]),
            "title": updated_project["title"],
            "description": updated_project["description"],
            "image": updated_project["image"],
            "technologies": updated_project["technologies"],
            "liveUrl": updated_project["liveUrl"],
            "githubUrl": updated_project["githubUrl"],
            "category": updated_project["category"]
        }
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error updating project: {str(e)}")
        raise HTTPException(status_code=500, detail="Error updating project")


@api_router.delete("/projects/{project_id}")
async def delete_project(project_id: str, token_data: dict = Depends(verify_token)):
    """Delete a project (requires authentication)"""
    try:
        if not ObjectId.is_valid(project_id):
            raise HTTPException(status_code=400, detail="Invalid project ID")
        
        result = await db.projects.delete_one({"_id": ObjectId(project_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Project not found")
        
        return {"success": True, "message": "Project deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error deleting project: {str(e)}")
        raise HTTPException(status_code=500, detail="Error deleting project")


# ========== CONTACT ENDPOINTS ==========

@api_router.post("/contact", response_model=ContactMessageResponse)
async def send_contact_message(message: ContactMessageCreate):
    """Send a contact message"""
    try:
        message_dict = message.dict()
        message_dict["date"] = datetime.utcnow()
        message_dict["read"] = False
        
        result = await db.contact_messages.insert_one(message_dict)
        created_message = await db.contact_messages.find_one({"_id": result.inserted_id})
        
        return {
            "id": str(created_message["_id"]),
            "name": created_message["name"],
            "email": created_message["email"],
            "subject": created_message["subject"],
            "message": created_message["message"],
            "date": created_message["date"].isoformat(),
            "read": created_message["read"]
        }
    except Exception as e:
        logging.error(f"Error sending contact message: {str(e)}")
        raise HTTPException(status_code=500, detail="Error sending message")


@api_router.get("/contact/messages", response_model=List[ContactMessageResponse])
async def get_contact_messages(token_data: dict = Depends(verify_token)):
    """Get all contact messages (requires authentication)"""
    try:
        messages = await db.contact_messages.find().sort("date", -1).to_list(1000)
        return [
            {
                "id": str(msg["_id"]),
                "name": msg["name"],
                "email": msg["email"],
                "subject": msg["subject"],
                "message": msg["message"],
                "date": msg["date"].isoformat() if isinstance(msg["date"], datetime) else msg["date"],
                "read": msg.get("read", False)
            }
            for msg in messages
        ]
    except Exception as e:
        logging.error(f"Error fetching messages: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching messages")


@api_router.delete("/contact/messages/{message_id}")
async def delete_contact_message(message_id: str, token_data: dict = Depends(verify_token)):
    """Delete a contact message (requires authentication)"""
    try:
        if not ObjectId.is_valid(message_id):
            raise HTTPException(status_code=400, detail="Invalid message ID")
        
        result = await db.contact_messages.delete_one({"_id": ObjectId(message_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Message not found")
        
        return {"success": True, "message": "Message deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error deleting message: {str(e)}")
        raise HTTPException(status_code=500, detail="Error deleting message")


# Health check endpoint
@api_router.get("/")
async def root():
    return {"message": "Portfolio API is running", "status": "healthy"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
