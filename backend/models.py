from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
from bson import ObjectId


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")


# Blog Post Models
class BlogPostCreate(BaseModel):
    title: str
    excerpt: str
    content: str
    image: str
    category: str
    tags: List[str]
    readTime: str = "5 min"


class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    image: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    readTime: Optional[str] = None


class BlogPostResponse(BaseModel):
    id: str
    title: str
    excerpt: str
    content: str
    image: str
    author: str
    date: str
    category: str
    readTime: str
    tags: List[str]

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}


# Project Models
class ProjectCreate(BaseModel):
    title: str
    description: str
    image: str
    technologies: List[str]
    liveUrl: str
    githubUrl: str
    category: str = "web"


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    technologies: Optional[List[str]] = None
    liveUrl: Optional[str] = None
    githubUrl: Optional[str] = None
    category: Optional[str] = None


class ProjectResponse(BaseModel):
    id: str
    title: str
    description: str
    image: str
    technologies: List[str]
    liveUrl: str
    githubUrl: str
    category: str

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}


# Contact Models
class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


class ContactMessageResponse(BaseModel):
    id: str
    name: str
    email: str
    subject: str
    message: str
    date: str
    read: bool = False

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}


# Auth Models
class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    username: str
    role: str


class TokenResponse(BaseModel):
    success: bool
    token: str
    user: UserResponse