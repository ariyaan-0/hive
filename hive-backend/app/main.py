from typing import Optional

from fastapi import Depends, FastAPI, Body, Response, status, HTTPException
from pydantic import BaseModel
from . import models
from .database import engine, get_db
from sqlalchemy.orm import Session
from . import schemas


models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Route or Path operation
@app.get("/")
async def root():
    return {"message": "Hello world"}


#Posts-------------------------------------------------------
@app.get("/posts")
def get_posts(db: Session = Depends(get_db)):
    posts = db.query(models.Post).all()
    return posts

@app.post("/posts", status_code=status.HTTP_201_CREATED, response_model=schemas.Post)
def create_posts(post : schemas.PostCreate, db: Session = Depends(get_db)):
    # new_post = models.Post(title = post.title, content = post.content, published = post.published)
    new_post = models.Post(**post.model_dump())
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post

@app.get("/posts/{id}", response_model=schemas.Post)
def get_post(id: str, db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(models.Post.id == id).first()
    # print(post)
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"post with id: {id} was not found")
    return post

@app.delete("/posts/{id}")
def delete_post(id: str, db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(models.Post.id == id)

    if post.first() == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"post with id: {id} not found")
    
    post.delete(synchronize_session=False)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)

@app.put("/posts/{id}")
def update_post(id: str, post:schemas.PostCreate, db: Session = Depends(get_db)):
    update_post = post.model_dump()
    post_query = db.query(models.Post).filter(models.Post.id == id)

    post = post_query.first()
    if post == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"post with id: {id} not found")
    
    post_query.update(update_post, synchronize_session=False)
    db.commit()

    return post_query.first()

#Users-------------------------------------------------------
@app.post("/users", status_code=status.HTTP_201_CREATED)
def create_user(db: Session = Depends(get_db)):
    pass