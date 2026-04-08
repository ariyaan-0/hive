from sqlalchemy import Column, UUID, ForeignKey, Integer, CheckConstraint
from ..database import Base

class Vote(Base):
    __tablename__ = "votes"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    post_id = Column(UUID(as_uuid=True), ForeignKey("posts.id", ondelete="CASCADE"), primary_key=True)
    dir = Column(Integer, CheckConstraint('dir IN (1, -1)'), nullable=False) 
    # 1 for upvote, -1 for downvote. (dir=0 in API deletes the row)
