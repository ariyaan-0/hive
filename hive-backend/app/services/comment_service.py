from sqlalchemy.orm import Session
from ..repositories.comment_repository import CommentRepository
from ..repositories.post_repository import PostRepository
from uuid import UUID
from ..core.exceptions import NotFoundException

class CommentService:
    def __init__(self, db: Session):
        self.comment_repository = CommentRepository(db)
        self.post_repository = PostRepository(db)

    def create_comment(self, comment_data: dict, user_id: UUID):
        # Check if post exists
        post = self.post_repository.get_by_id(comment_data['post_id'])
        if not post:
            raise NotFoundException(f"Post with id: {comment_data['post_id']} does not exist")

        comment_data['user_id'] = user_id
        return self.comment_repository.create(comment_data)

    def get_comments_by_post_id(self, post_id: UUID):
        return self.comment_repository.get_by_post_id(post_id)
