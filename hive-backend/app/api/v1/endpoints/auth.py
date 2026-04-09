from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from ....db.session import get_db
from ....services.user_service import UserService
from ....utils import auth
from ....core import security, config
from .... import schemas

router = APIRouter()

@router.post('/login', response_model=schemas.Token)
def login(user_credentials: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    service = UserService(db)
    user = service.get_user_by_email(user_credentials.username)

    if not user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid Credentials")
    
    if not auth.verify(user_credentials.password, user.password):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid Credentials")
    
    access_token = security.create_access_token(data={"user_id": str(user.id)}) 
    
    return {"access_token": access_token, "token_type": "bearer"}
