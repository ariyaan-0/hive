from pydantic import BaseModel
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