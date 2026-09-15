from datetime import datetime, timedelta, timezone
from uuid import uuid4

from jose import JWTError, jwt
from passlib.context import CryptContext

from .config import get_settings

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


def create_token(subject: str, token_type: str, expires_delta: timedelta) -> str:
    now = datetime.now(timezone.utc)
    payload = {"sub": subject, "type": token_type, "iat": now, "jti": str(uuid4()), "exp": now + expires_delta}
    return jwt.encode(payload, get_settings().jwt_secret_key, algorithm=ALGORITHM)


def create_access_token(user_id: str) -> str:
    return create_token(user_id, "access", timedelta(minutes=get_settings().access_token_expire_minutes))


def create_refresh_token(user_id: str) -> str:
    return create_token(user_id, "refresh", timedelta(days=get_settings().refresh_token_expire_days))


def decode_token(token: str, expected_type: str = "access") -> str:
    try:
        payload = jwt.decode(token, get_settings().jwt_secret_key, algorithms=[ALGORITHM])
    except JWTError as error:
        raise ValueError("Invalid token") from error
    if payload.get("type") != expected_type or not payload.get("sub"):
        raise ValueError("Invalid token type")
    return payload["sub"]
