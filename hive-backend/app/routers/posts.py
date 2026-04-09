from fastapi import APIRouter, Depends, status, HTTPException, Response, File, UploadFile, Form
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from .. import models, schemas, oauth2
from ..database import get_db
from ..utils import media

router = APIRouter(
    prefix="/posts",
    tags=['Posts']
)

@router.get("/", response_model=List[schemas.PostOut])
def get_posts(db: Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user), limit: int = 10, skip: int = 0, search: Optional[str] = ""):
    
    # Using subqueries to avoid Cartesian product issues when joining votes and comments
    votes_subquery = db.query(models.Vote.post_id, func.sum(models.Vote.dir).label("vote_sum")).group_by(models.Vote.post_id).subquery()
    comments_subquery = db.query(models.Comment.post_id, func.count(models.Comment.id).label("comment_count")).group_by(models.Comment.post_id).subquery()

    posts = db.query(
        models.Post, 
        func.coalesce(votes_subquery.c.vote_sum, 0).label("votes"),
        func.coalesce(comments_subquery.c.comment_count, 0).label("comment_count")
    ).outerjoin(
        votes_subquery, models.Post.id == votes_subquery.c.post_id
    ).outerjoin(
        comments_subquery, models.Post.id == comments_subquery.c.post_id
    ).filter(
        models.Post.title.contains(search)
    ).limit(limit).offset(skip).all()
    
    return posts

@router.get("/user", response_model=List[schemas.PostOut])
def get_user_posts(user_id: Optional[str] = None, db: Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user)):
    """Fetch all posts for a specific user. If user_id is not provided, returns the current user's posts."""
    if not user_id:
        target_user_id = current_user.id
    else:
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with id: {user_id} was not found")
        target_user_id = user_id

    votes_subquery = db.query(models.Vote.post_id, func.sum(models.Vote.dir).label("vote_sum")).group_by(models.Vote.post_id).subquery()
    comments_subquery = db.query(models.Comment.post_id, func.count(models.Comment.id).label("comment_count")).group_by(models.Comment.post_id).subquery()

    posts = db.query(
        models.Post, 
        func.coalesce(votes_subquery.c.vote_sum, 0).label("votes"),
        func.coalesce(comments_subquery.c.comment_count, 0).label("comment_count")
    ).outerjoin(
        votes_subquery, models.Post.id == votes_subquery.c.post_id
    ).outerjoin(
        comments_subquery, models.Post.id == comments_subquery.c.post_id
    ).filter(
        models.Post.owner_id == target_user_id
    ).order_by(models.Post.created_at.desc()).all()
            
    return posts

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.Post)
def create_posts(
    title: str = Form(...),
    content: str = Form(...),
    published: bool = Form(True),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(oauth2.get_current_user)
):
    imageURL = None
    if file:
        imageURL = media.upload_image(file.file, file.filename, folder="/posts")
        if not imageURL:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to upload image")

    new_post = models.Post(
        owner_id=current_user.id,
        title=title,
        content=content,
        published=published,
        imageURL=imageURL
    )
    
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post

@router.get("/{id}", response_model=schemas.PostOut)
def get_post(id: str, db: Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user)):
    
    votes_subquery = db.query(models.Vote.post_id, func.sum(models.Vote.dir).label("vote_sum")).group_by(models.Vote.post_id).subquery()
    comments_subquery = db.query(models.Comment.post_id, func.count(models.Comment.id).label("comment_count")).group_by(models.Comment.post_id).subquery()

    post = db.query(
        models.Post, 
        func.coalesce(votes_subquery.c.vote_sum, 0).label("votes"),
        func.coalesce(comments_subquery.c.comment_count, 0).label("comment_count")
    ).outerjoin(
        votes_subquery, models.Post.id == votes_subquery.c.post_id
    ).outerjoin(
        comments_subquery, models.Post.id == comments_subquery.c.post_id
    ).filter(
        models.Post.id == id
    ).first()

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

@router.patch("/{id}", response_model=schemas.PostOut)
def update_post(id: str, post: schemas.PostUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user)):
    post_query = db.query(models.Post).filter(models.Post.id == id)
    post_found = post_query.first()

    if post_found == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"post with id: {id} not found")
        
    if post_found.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to perform requested action")
    
    update_data = post.model_dump(exclude_unset=True)
    if update_data:
        post_query.update(update_data, synchronize_session=False)
        db.commit()

    # Re-fetch with counts
    votes_subquery = db.query(models.Vote.post_id, func.sum(models.Vote.dir).label("vote_sum")).group_by(models.Vote.post_id).subquery()
    comments_subquery = db.query(models.Comment.post_id, func.count(models.Comment.id).label("comment_count")).group_by(models.Comment.post_id).subquery()

    updated_post = db.query(
        models.Post, 
        func.coalesce(votes_subquery.c.vote_sum, 0).label("votes"),
        func.coalesce(comments_subquery.c.comment_count, 0).label("comment_count")
    ).outerjoin(
        votes_subquery, models.Post.id == votes_subquery.c.post_id
    ).outerjoin(
        comments_subquery, models.Post.id == comments_subquery.c.post_id
    ).filter(
        models.Post.id == id
    ).first()

    return updated_post
