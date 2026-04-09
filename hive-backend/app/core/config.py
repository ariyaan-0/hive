from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    url_database: str
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    imagekit_private_key: str
    imagekit_public_key: str
    imagekit_url: str

    class Config:
        env_file = ".env"

settings = Settings()
