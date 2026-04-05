from typing import Optional

from fastapi import Depends, FastAPI, Body, status, HTTPException
from pydantic import BaseModel
from . import models
from .database import engine, get_db
from sqlalchemy.orm import Session


models.Base.metadata.create_all(bind=engine)

app = FastAPI()



class Post(BaseModel):
    title: str
    content: str
    published: bool = True
    rating: Optional[int] = None


# Route or Path operation
@app.get("/")
async def root():
    return {"message": "Hello world"}

@app.get("/sqlalchemy")
def test_posts(db: Session = Depends(get_db)):
    return {"status": "Success"}

@app.get("/posts")
def get_posts():
    return {"data": "This is your posts"}

@app.post("/posts", status_code=status.HTTP_201_CREATED)
def create_posts(new_post : Post):
    print(new_post.model_dump())
    return {"message": "new post has been created"}