from fastapi import APIRouter, Depends, status, HTTPException, Response
from typing import List, Optional
from sqlalchemy.orm import Session
from .. import models, schemas, oauth2
from ..database import get_db

router = APIRouter(
    prefix="/posts",
    tags=['Posts']
)

@router.get("/", response_model=List[schemas.Post])
def get_posts(db: Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user), limit: int = 10, skip: int = 0, search: Optional[str] = ""):
    posts = db.query(models.Post).filter(models.Post.title.contains(search)).limit(limit).offset(skip).all()
    return posts

@router.get("/user", response_model=List[schemas.Post])
def get_user_posts(user_id: Optional[str] = None, db: Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user)):
    """Fetch all posts for a specific user. If user_id is not provided, returns the current user's posts."""
    if not user_id:
        target_user_id = current_user.id
    else:
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with id: {user_id} was not found")
        target_user_id = user_id

    posts = db.query(models.Post).filter(models.Post.owner_id == target_user_id).order_by(models.Post.created_at.desc()).all()
    return posts

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.Post)
def create_posts(post : schemas.PostCreate, db: Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user)):
    new_post = models.Post(owner_id=current_user.id, **post.model_dump())
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post

@router.get("/{id}", response_model=schemas.Post)
def get_post(id: str, db: Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user)):
    post = db.query(models.Post).filter(models.Post.id == id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"post with id: {id} was not found")
    return post

@router.delete("/{id}")
def delete_post(id: str, db: Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user)):
    post_query = db.query(models.Post).filter(models.Post.id == id)

    post_found = post_query.first()

    if post_found == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"post with id: {id} not found")
        
    if post_found.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to perform requested action")
    
    post_query.delete(synchronize_session=False)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.patch("/{id}", response_model=schemas.Post)
def update_post(id: str, post: schemas.PostUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user)):
    post_query = db.query(models.Post).filter(models.Post.id == id)
    post_found = post_query.first()

    if post_found == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"post with id: {id} not found")
        
    if post_found.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to perform requested action")
    
    # Filter out fields that are not provided in the request body
    update_data = post.model_dump(exclude_unset=True)
    
    if not update_data:
        # If no fields are provided to update, just return the existing post
        return post_found

    post_query.update(update_data, synchronize_session=False)
    db.commit()

    return post_query.first()
