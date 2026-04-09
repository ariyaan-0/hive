from typing import Any, Dict, Optional

class AppException(Exception):

    ## Base class for all domain-specific exceptions
    def __init__(
        self, 
        message: str, 
        status_code: int = 400, 
        headers: Optional[Dict[str, Any]] = None
    ):
        self.message = message
        self.status_code = status_code
        self.headers = headers

class NotFoundException(AppException):
    def __init__(self, message: str = "Resource not found"):
        super().__init__(message, status_code=404)

class UnauthorizedException(AppException):
    def __init__(self, message: str = "Could not validate credentials"):
        super().__init__(
            message, 
            status_code=401, 
            headers={"WWW-Authenticate": "Bearer"}
        )

class ForbiddenException(AppException):
    def __init__(self, message: str = "Not authorized to perform requested action"):
        super().__init__(message, status_code=403)

class ConflictException(AppException):
    def __init__(self, message: str = "Resource already exists or conflict occurred"):
        super().__init__(message, status_code=409)
