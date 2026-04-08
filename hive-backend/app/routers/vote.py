from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, database, models, oauth2

router = APIRouter(
    prefix="/vote",
    tags=['Vote']
)

@router.post("/", status_code=status.HTTP_201_CREATED)
def vote(vote: schemas.Vote, db: Session = Depends(database.get_db), current_user: models.User = Depends(oauth2.get_current_user)):

    ##Voting Algorithm---
    ## Step 1: Get the post
    ## Step 2: Check if any vote exists for this post by this user
    ## Step 3: If yes-> Match the vote with user's requested vote
    ##          Case 1: vote direction 0 means delete the existing vote
    ##          Case 2: vote direction same means prevent that voting attepmt
    ##          Case 3: vote direction opposite means update with this new direction
    ## Step 4: If no -> Means user never voted this post, so craete a new vote for this user under this post

    # Grab the post
    post = db.query(models.Post).filter(models.Post.id == vote.post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Post with id: {vote.post_id} does not exist")

    vote_query = db.query(models.Vote).filter(models.Vote.post_id == vote.post_id, models.Vote.user_id == current_user.id)
    found_vote = vote_query.first()

    if vote.dir == 0:
        if found_vote:
            vote_query.delete(synchronize_session=False)
            db.commit()
            return {"message": "successfully removed vote"}
        else:
            return {"message": "no vote to remove"}
    
    if found_vote:
        if found_vote.dir == vote.dir:
            # If user sends the same vote again, we can either error out or toggle.
            # Let's error out to be explicit that they already voted this way.
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"user {current_user.id} has already voted on post {vote.post_id}")
        else:
            # Change vote direction
            found_vote.dir = vote.dir
            db.commit()
            return {"message": "successfully changed vote"}
    else:
        # Create new vote
        new_vote = models.Vote(post_id=vote.post_id, user_id=current_user.id, dir=vote.dir)
        db.add(new_vote)
        db.commit()
        return {"message": "successfully added vote"}
