from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone

SECRET_KEY = '4342fddd80738a56438b94074c7aa3a3e6223a5d46b36cb32655686093ce4fef'
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt