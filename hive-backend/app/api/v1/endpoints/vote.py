from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from .... import schemas, models
from ....db.session import get_db
from ....services.vote_service import VoteService
from ....core import security

router = APIRouter()

@router.post("/", status_code=status.HTTP_201_CREATED)
def vote(
    vote: schemas.Vote, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(security.get_current_user)
):
    service = VoteService(db)
    return service.cast_vote(vote.post_id, current_user.id, vote.dir)
