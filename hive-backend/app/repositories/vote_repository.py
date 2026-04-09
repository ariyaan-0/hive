from sqlalchemy.orm import Session
from .. import models
from uuid import UUID

class VoteRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_vote(self, post_id: UUID, user_id: UUID):
        return self.db.query(models.Vote).filter(
            models.Vote.post_id == post_id, 
            models.Vote.user_id == user_id
        ).first()

    def create(self, post_id: UUID, user_id: UUID, dir: int):
        new_vote = models.Vote(post_id=post_id, user_id=user_id, dir=dir)
        self.db.add(new_vote)
        self.db.commit()
        return new_vote

    def delete(self, post_id: UUID, user_id: UUID):
        vote_query = self.db.query(models.Vote).filter(
            models.Vote.post_id == post_id, 
            models.Vote.user_id == user_id
        )
        vote_query.delete(synchronize_session=False)
        self.db.commit()
        return True

    def update_dir(self, post_id: UUID, user_id: UUID, dir: int):
        vote_query = self.db.query(models.Vote).filter(
            models.Vote.post_id == post_id, 
            models.Vote.user_id == user_id
        )
        vote_query.update({"dir": dir}, synchronize_session=False)
        self.db.commit()
        return vote_query.first()
