from fastapi import APIRouter, Depends, status, HTTPException, Response, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import Optional, Union
from uuid import UUID
from .... import schemas, models
from ....db.session import get_db
from ....services.user_service import UserService
from ....core import security
from ....utils import media

router = APIRouter()

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
    service = UserService(db)
    
    imageURL = None
    if file:
        imageURL = media.upload_image(file.file, file.filename, folder="/users")
        if not imageURL:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to upload image")

    user_data = {
        "name": name,
        "username": username,
        "email": email,
        "password": password,
        "bio": bio,
        "imageURL": imageURL
    }
    
    return service.create_user(user_data)

@router.get("/{id}", response_model=Union[schemas.UserOut, schemas.UserPublicOut])
def get_user(
    id: UUID, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    service = UserService(db)
    user = service.get_user_by_id(id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with id: {id} does not exist")
    
    if current_user.id == id:
        return schemas.UserOut.model_validate(user)
    
    return schemas.UserPublicOut.model_validate(user)

@router.delete("/{id}")
def delete_user(
    id: UUID, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    if current_user.id != id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Not authorized to perform requested action"
        )
    
    service = UserService(db)
    success = service.delete_user(id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with id: {id} does not exist")
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.put("/{id}", response_model=schemas.UserOut)
def update_user(
    id: UUID, 
    name: Optional[str] = Form(None),
    username: Optional[str] = Form(None),
    email: Optional[str] = Form(None),
    password: Optional[str] = Form(None),
    bio: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    if current_user.id != id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Not authorized to perform requested action"
        )
    
    update_data = {}
    if name is not None: update_data["name"] = name
    if username is not None: update_data["username"] = username
    if email is not None: update_data["email"] = email
    if password is not None: update_data["password"] = password
    if bio is not None: update_data["bio"] = bio
    
    if file:
        imageURL = media.upload_image(file.file, file.filename, folder="/users")
        if not imageURL:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to upload image")
        update_data["imageURL"] = imageURL
    
    service = UserService(db)
    updated_user = service.update_user(id, update_data)
    if not updated_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with id: {id} does not exist")
    return updated_user
