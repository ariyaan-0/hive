from fastapi import APIRouter, Depends, status, HTTPException, Response, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import Optional
from .. import models, schemas
from ..database import get_db
from ..utils import auth, media


router = APIRouter(
    prefix="/users",
    tags=['Users']
)

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.UserOut)
def create_user(
    name: str = Form(...),
    username: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    bio: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """
    Best practice: Use multipart/form-data for file uploads and text inputs.
    We handle hashing and storage in the router then save to DB.
    """
    
    #hash the password
    hashed_password = auth.hash(password)
    
    imageURL = None
    if file:
        # Upload to ImageKit
        imageURL = media.upload_image(file.file, file.filename, folder="/users")
        if not imageURL:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to upload image")

    new_user = models.User(
        name=name,
        username=username,
        email=email,
        password=hashed_password,
        bio=bio,
        imageURL=imageURL
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@router.get("/{id}", response_model=schemas.UserOut)
def get_user(id: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == id).first()
    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with id: {id} does not exist")
    
    return user

@router.delete("/{id}")
def delete_user(id: str, db: Session = Depends(get_db)):
    user_query = db.query(models.User).filter(models.User.id == id)
    
    if user_query.first() == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with id: {id} does not exist")
    
    user_query.delete(synchronize_session=False)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.put("/{id}", response_model=schemas.UserOut)
def update_user(id: str, user: schemas.UserCreate, db: Session = Depends(get_db)):
    user_query = db.query(models.User).filter(models.User.id == id)
    existing_user = user_query.first()
    
    if existing_user == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with id: {id} does not exist")
    
    user_query.update(user.model_dump(), synchronize_session=False)
    db.commit()

    return user_query.first()
