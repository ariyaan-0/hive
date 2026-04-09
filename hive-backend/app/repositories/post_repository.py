from sqlalchemy.orm import Session
from sqlalchemy import func
from .. import models, schemas
from uuid import UUID
from typing import Optional

class PostRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all_with_counts(self, limit: int = 10, skip: int = 0, search: str = ""):
        votes_subquery = self.db.query(models.Vote.post_id, func.sum(models.Vote.dir).label("vote_sum")).group_by(models.Vote.post_id).subquery()
        comments_subquery = self.db.query(models.Comment.post_id, func.count(models.Comment.id).label("comment_count")).group_by(models.Comment.post_id).subquery()

        return self.db.query(
            models.Post, 
            func.coalesce(votes_subquery.c.vote_sum, 0).label("votes"),
            func.coalesce(comments_subquery.c.comment_count, 0).label("comment_count")
        ).outerjoin(
            votes_subquery, models.Post.id == votes_subquery.c.post_id
        ).outerjoin(
            comments_subquery, models.Post.id == comments_subquery.c.post_id
        ).filter(
            models.Post.title.contains(search)
        ).limit(limit).offset(skip).all()

    def get_user_posts_with_counts(self, user_id: UUID):
        votes_subquery = self.db.query(models.Vote.post_id, func.sum(models.Vote.dir).label("vote_sum")).group_by(models.Vote.post_id).subquery()
        comments_subquery = self.db.query(models.Comment.post_id, func.count(models.Comment.id).label("comment_count")).group_by(models.Comment.post_id).subquery()

        return self.db.query(
            models.Post, 
            func.coalesce(votes_subquery.c.vote_sum, 0).label("votes"),
            func.coalesce(comments_subquery.c.comment_count, 0).label("comment_count")
        ).outerjoin(
            votes_subquery, models.Post.id == votes_subquery.c.post_id
        ).outerjoin(
            comments_subquery, models.Post.id == comments_subquery.c.post_id
        ).filter(
            models.Post.owner_id == user_id
        ).order_by(models.Post.created_at.desc()).all()

    def get_by_id_with_counts(self, post_id: UUID):
        votes_subquery = self.db.query(models.Vote.post_id, func.sum(models.Vote.dir).label("vote_sum")).group_by(models.Vote.post_id).subquery()
        comments_subquery = self.db.query(models.Comment.post_id, func.count(models.Comment.id).label("comment_count")).group_by(models.Comment.post_id).subquery()

        return self.db.query(
            models.Post, 
            func.coalesce(votes_subquery.c.vote_sum, 0).label("votes"),
            func.coalesce(comments_subquery.c.comment_count, 0).label("comment_count")
        ).outerjoin(
            votes_subquery, models.Post.id == votes_subquery.c.post_id
        ).outerjoin(
            comments_subquery, models.Post.id == comments_subquery.c.post_id
        ).filter(
            models.Post.id == post_id
        ).first()

    def get_by_id(self, post_id: UUID):
        return self.db.query(models.Post).filter(models.Post.id == post_id).first()

    def create(self, post_data: dict):
        new_post = models.Post(**post_data)
        self.db.add(new_post)
        self.db.commit()
        self.db.refresh(new_post)
        return new_post

    def update(self, post_id: UUID, post_data: dict):
        post_query = self.db.query(models.Post).filter(models.Post.id == post_id)
        post_query.update(post_data, synchronize_session=False)
        self.db.commit()
        return post_query.first()

    def delete(self, post_id: UUID):
        post_query = self.db.query(models.Post).filter(models.Post.id == post_id)
        post = post_query.first()
        if post:
            post_query.delete(synchronize_session=False)
            self.db.commit()
            return True
        return False
