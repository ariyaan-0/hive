from fastapi import APIRouter, Depends, status, HTTPException, Response
from sqlalchemy.orm import Session

from .. import database, schemas, models, utils

router = APIRouter(
    prefix="/login",
    tags=['Authentication']
    )

@router.post('/')
def login(user_credentials: schemas.UserLogin, db: Session = Depends(database.get_db)):
    ## Grab the user first
    user = db.query(models.User).filter(models.User.email == user_credentials.email).first()

    ## Step 1: Match the credentials
    ## Step 2: Create Tokens
    ## Step 3: Return Tokens

    if not user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid Credentials")
    
    if not utils.verify(user_credentials.password, user.password):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid Credentials")
    
    return {"Message": "Successfully Logged in"}