from fastapi import APIRouter, Depends, status, HTTPException, Response
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from .. import database, schemas, models, utils, oauth2

router = APIRouter(
    prefix="",
    tags=['Authentication']
    )

@router.post('/login')
def login(user_credentials: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    
    ## This OAuth2PasswordRequestForm doesn't store data according to my defined schema.
    ## It has its own schema that is {username: "any_username_or_email", password: "password"}
    ## While accessing user_credential with this, I cannot use user_credentials.email
    ## I have to use user_credentials.username (that can be user name or email dependending on what I am sending)

    ## Grab the user first
    user = db.query(models.User).filter(models.User.email == user_credentials.username).first()

    ## Step 1: Match the credentials
    ## Step 2: Create Tokens
    ## Step 3: Return Tokens

    if not user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid Credentials")
    
    if not utils.verify(user_credentials.password, user.password):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid Credentials")
    
    access_token = oauth2.create_access_token(data={"user_id": str(user.id)}) 
    #user.id is wrapped with str() because of the following error
    #TypeError: Object of type UUID is not JSON serializable; SOLn-> convert it to string
    
    return {"access_token": access_token, "token_type": "bearer"}