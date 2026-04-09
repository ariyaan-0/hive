from sqlalchemy.orm import Session
from .. import models
from uuid import UUID

class CommentRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_post_id(self, post_id: UUID):
        return self.db.query(models.Comment).filter(models.Comment.post_id == post_id).all()

    def create(self, comment_data: dict):
        new_comment = models.Comment(**comment_data)
        self.db.add(new_comment)
        self.db.commit()
        self.db.refresh(new_comment)
        return new_comment
