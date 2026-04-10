from fastapi import APIRouter, Depends, status, HTTPException, Response, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from .... import schemas, models
from ....db.session import get_db
from ....services.post_service import PostService
from ....core import security
from ....utils import media

router = APIRouter()

@router.get("/", response_model=List[schemas.PostOut])
def get_posts(
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(security.get_current_user), 
    limit: int = 10, skip: int = 0, search: Optional[str] = ""
):
    service = PostService(db)
    return service.get_posts(limit, skip, search)

@router.get("/user", response_model=List[schemas.PostOut])
def get_user_posts(
    user_id: Optional[UUID] = None, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(security.get_current_user)
):
    service = PostService(db)
    target_user_id = user_id or current_user.id
    return service.get_user_posts(target_user_id)

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.Post)
def create_posts(
    title: str = Form(...),
    content: str = Form(...),
    published: bool = Form(True),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(security.get_current_user)
):
    service = PostService(db)
    
    imageURL = None
    if file:
        imageURL = media.upload_image(file.file, file.filename, folder="/posts")
        if not imageURL:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to upload image")

    post_data = {
        "title": title,
        "content": content,
        "published": published,
        "imageURL": imageURL
    }
    
    return service.create_post(post_data, current_user.id)

@router.get("/{id}", response_model=schemas.PostOut)
def get_post(
    id: UUID, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(security.get_current_user)
):
    service = PostService(db)
    return service.get_post_by_id(id)

@router.delete("/{id}")
def delete_post(
    id: UUID, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(security.get_current_user)
):
    service = PostService(db)
    service.delete_post(id, current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.patch("/{id}", response_model=schemas.Post)
def update_post(
    id: UUID, 
    title: Optional[str] = Form(None),
    content: Optional[str] = Form(None),
    published: Optional[bool] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(security.get_current_user)
):
    service = PostService(db)
    
    update_data = {}
    if title is not None: update_data["title"] = title
    if content is not None: update_data["content"] = content
    if published is not None: update_data["published"] = published
    
    if file:
        imageURL = media.upload_image(file.file, file.filename, folder="/posts")
        if not imageURL:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to upload image")
        update_data["imageURL"] = imageURL
        
    return service.update_post(id, update_data, current_user.id)
