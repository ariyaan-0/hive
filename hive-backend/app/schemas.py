from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from uuid import UUID


class PostBase(BaseModel):
    title: str
    content: str
    imageURL: Optional[str] = None
    published: bool = True

class PostCreate(PostBase):
    pass

class Post(PostBase):
    id: UUID
    created_at: datetime
    owner_id: UUID

    model_config = {
        "from_attributes": True
    }

class UserCreate(BaseModel):
    name: str
    username: str
    email: EmailStr
    password: str
    imageURL: Optional[str] = None
    bio: Optional[str] = None


class UserOut(BaseModel):
    id: UUID
    name: str
    username: str
    email: EmailStr
    imageURL: Optional[str] = None
    bio: Optional[str] = None
    created_at: datetime

    model_config = {
        "from_attributes": True
    }




class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    id: Optional[str] = None