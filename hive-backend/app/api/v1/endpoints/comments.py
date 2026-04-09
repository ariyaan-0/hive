from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from .... import schemas, models
from ....db.session import get_db
from ....services.comment_service import CommentService
from ....core import security

router = APIRouter()

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.Comment)
def create_comment(
    comment: schemas.CommentCreate, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(security.get_current_user)
):
    service = CommentService(db)
    return service.create_comment(comment.model_dump(), current_user.id)

@router.get("/{post_id}", response_model=List[schemas.Comment])
def get_comments(post_id: UUID, db: Session = Depends(get_db)):
    service = CommentService(db)
    return service.get_comments_by_post_id(post_id)
