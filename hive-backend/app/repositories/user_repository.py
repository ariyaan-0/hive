from sqlalchemy.orm import Session
from .. import models, schemas
from uuid import UUID

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, user_id: UUID):
        return self.db.query(models.User).filter(models.User.id == user_id).first()

    def get_by_email(self, email: str):
        return self.db.query(models.User).filter(models.User.email == email).first()

    def create(self, user_data: dict):
        new_user = models.User(**user_data)
        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)
        return new_user

    def update(self, user_id: UUID, user_data: dict):
        user_query = self.db.query(models.User).filter(models.User.id == user_id)
        user_query.update(user_data, synchronize_session=False)
        self.db.commit()
        return user_query.first()

    def delete(self, user_id: UUID):
        user_query = self.db.query(models.User).filter(models.User.id == user_id)
        user = user_query.first()
        if user:
            user_query.delete(synchronize_session=False)
            self.db.commit()
            return True
        return False
