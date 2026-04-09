from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from . import models
from .db.session import engine
from .api.v1.api import api_router
from .core.exceptions import AppException

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hive API", version="1.0.0")

@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message},
        headers=exc.headers
    )

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to Hive API. Access v1 at /api/v1"}
