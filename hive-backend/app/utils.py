import bcrypt

def hash(password: str):
    
    # Encode the password to bytes, then hash it, then decode the hash string back to string
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(pwd_bytes, salt)
    return hashed_password.decode('utf-8')


def verify(plain_password: str, hashed_password: str):
    
    # Check the encoded password against the encoded hash
    password_bytes = plain_password.encode('utf-8')
    hashed_password_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_password_bytes)