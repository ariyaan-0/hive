from sqlalchemy.orm import Session
from ..repositories.vote_repository import VoteRepository
from ..repositories.post_repository import PostRepository
from uuid import UUID
from ..core.exceptions import NotFoundException, ConflictException

class VoteService:
    def __init__(self, db: Session):
        self.vote_repository = VoteRepository(db)
        self.post_repository = PostRepository(db)

    def cast_vote(self, post_id: UUID, user_id: UUID, dir: int):
        # Check if post exists
        post = self.post_repository.get_by_id(post_id)
        if not post:
            raise NotFoundException(f"Post with id: {post_id} does not exist")

        found_vote = self.vote_repository.get_vote(post_id, user_id)

        if dir == 0:
            if found_vote:
                self.vote_repository.delete(post_id, user_id)
                return {"message": "successfully removed vote"}
            else:
                return {"message": "no vote to remove"}
        
        if found_vote:
            if found_vote.dir == dir:
                raise ConflictException(f"user {user_id} has already voted on post {post_id}")
            else:
                self.vote_repository.update_dir(post_id, user_id, dir)
                return {"message": "successfully changed vote"}
        else:
            self.vote_repository.create(post_id, user_id, dir)
            return {"message": "successfully added vote"}
