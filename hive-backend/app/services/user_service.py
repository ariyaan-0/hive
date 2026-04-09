from sqlalchemy.orm import Session
from ..repositories.user_repository import UserRepository
from ..utils import auth
from uuid import UUID

class UserService:
    def __init__(self, db: Session):
        self.repository = UserRepository(db)

    def create_user(self, user_data: dict):
        user_data['password'] = auth.hash(user_data['password'])
        return self.repository.create(user_data)

    def get_user_by_id(self, user_id: UUID):
        return self.repository.get_by_id(user_id)

    def get_user_by_email(self, email: str):
        return self.repository.get_by_email(email)

    def update_user(self, user_id: UUID, user_data: dict):
        return self.repository.update(user_id, user_data)

    def delete_user(self, user_id: UUID):
        return self.repository.delete(user_id)
