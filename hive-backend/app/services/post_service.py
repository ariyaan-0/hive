from sqlalchemy.orm import Session
from ..repositories.post_repository import PostRepository
from uuid import UUID
from typing import Optional
from ..core.exceptions import NotFoundException, ForbiddenException
from ..utils import media

class PostService:
    def __init__(self, db: Session):
        self.repository = PostRepository(db)

    def get_posts(self, limit: int = 10, skip: int = 0, search: str = ""):
        return self.repository.get_all_with_counts(limit, skip, search)

    def get_user_posts(self, user_id: UUID):
        return self.repository.get_user_posts_with_counts(user_id)

    def get_post_by_id(self, post_id: UUID):
        post = self.repository.get_by_id_with_counts(post_id)
        if not post:
            raise NotFoundException(f"post with id: {post_id} was not found")
        return post

    def create_post(self, post_data: dict, owner_id: UUID):
        post_data['owner_id'] = owner_id
        return self.repository.create(post_data)

    def update_post(self, post_id: UUID, post_data: dict, current_user_id: UUID):
        post = self.repository.get_by_id(post_id)
        if not post:
            raise NotFoundException(f"post with id: {post_id} not found")
        
        if post.owner_id != current_user_id:
            raise ForbiddenException()
            
        # Detect if we uploaded a dynamically new ImageURL, trigger purge for old
        if "imageURL" in post_data and post.imageURL and post_data["imageURL"] != post.imageURL:
            media.delete_image_by_url(post.imageURL)
        
        return self.repository.update(post_id, post_data)

    def delete_post(self, post_id: UUID, current_user_id: UUID):
        post = self.repository.get_by_id(post_id)
        if not post:
            raise NotFoundException(f"post with id: {post_id} not found")
        
        if post.owner_id != current_user_id:
            raise ForbiddenException()
            
        # Drop orphaned media physically before Database deletion
        if post.imageURL:
            media.delete_image_by_url(post.imageURL)
        
        return self.repository.delete(post_id)
