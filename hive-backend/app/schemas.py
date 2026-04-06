from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class PostBase(BaseModel):
    title: str
    content: str
    imageURL: Optional[str] = None
    published: bool = True

class PostCreate(PostBase):
    pass


class Post(PostBase):
    created_at: datetime

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