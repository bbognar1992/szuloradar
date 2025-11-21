from datetime import datetime, timedelta
from typing import Optional
import hashlib
import logging
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials, HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from config import settings
from database import get_db
from models.user import User

# Suppress passlib warnings about bcrypt version detection
logging.getLogger("passlib.handlers.bcrypt").setLevel(logging.ERROR)

# Simple HTTP Basic Authentication scheme
security = HTTPBasic()

# JWT Bearer token authentication scheme
bearer_scheme = HTTPBearer(auto_error=False)

# Lazy initialization of CryptContext to avoid module-level initialization issues
# Passlib's internal bug detection may fail with long passwords, so we initialize lazily
_pwd_context = None
_use_bcrypt_directly = False

def _get_pwd_context():
    """Get or create the password context (lazy initialization)"""
    global _pwd_context, _use_bcrypt_directly
    if _pwd_context is None and not _use_bcrypt_directly:
        try:
            _pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        except (ValueError, AttributeError):
            # If passlib initialization fails (e.g., during internal bug detection),
            # fall back to using bcrypt directly
            _use_bcrypt_directly = True
    return _pwd_context


def _prepare_password_for_bcrypt(password: str):
    """Prepare password for bcrypt by hashing with SHA256 if it's too long
    This allows support for passwords of any length while using bcrypt
    Returns bytes for long passwords, str for short ones (passlib handles both)
    """
    password_bytes = password.encode('utf-8')
    # If password is longer than 72 bytes, hash it with SHA256 first
    # SHA256 produces a fixed 32-byte output, which is well under bcrypt's 72-byte limit
    if len(password_bytes) > 72:
        sha256_hash_bytes = hashlib.sha256(password_bytes).digest()  # Returns 32 bytes
        # Convert to hex string for passlib compatibility (passlib works with strings)
        return sha256_hash_bytes.hex()
    return password


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    global _use_bcrypt_directly
    # Prepare password for bcrypt (hash with SHA256 if needed)
    prepared_password = _prepare_password_for_bcrypt(plain_password)
    
    if _use_bcrypt_directly:
        # Fallback to bcrypt directly if passlib failed to initialize
        import bcrypt
        prepared_bytes = prepared_password.encode('utf-8') if isinstance(prepared_password, str) else prepared_password
        try:
            return bcrypt.checkpw(prepared_bytes, hashed_password.encode('utf-8'))
        except Exception:
            return False
    
    try:
        return _get_pwd_context().verify(prepared_password, hashed_password)
    except ValueError as e:
        # If passlib fails during backend initialization, fall back to bcrypt directly
        if "password cannot be longer than 72 bytes" in str(e):
            _use_bcrypt_directly = True
            import bcrypt
            prepared_bytes = prepared_password.encode('utf-8') if isinstance(prepared_password, str) else prepared_password
            try:
                return bcrypt.checkpw(prepared_bytes, hashed_password.encode('utf-8'))
            except Exception:
                return False
        raise


def get_password_hash(password: str) -> str:
    """Hash a password - supports passwords of any length"""
    global _use_bcrypt_directly
    # Prepare password for bcrypt (hash with SHA256 if needed)
    prepared_password = _prepare_password_for_bcrypt(password)
    
    if _use_bcrypt_directly:
        # Fallback to bcrypt directly if passlib failed to initialize
        import bcrypt
        prepared_bytes = prepared_password.encode('utf-8') if isinstance(prepared_password, str) else prepared_password
        salt = bcrypt.gensalt(rounds=12)
        return bcrypt.hashpw(prepared_bytes, salt).decode('utf-8')
    
    try:
        return _get_pwd_context().hash(prepared_password)
    except ValueError as e:
        # If passlib fails during backend initialization (e.g., bug detection),
        # fall back to bcrypt directly
        if "password cannot be longer than 72 bytes" in str(e):
            _use_bcrypt_directly = True
            import bcrypt
            prepared_bytes = prepared_password.encode('utf-8') if isinstance(prepared_password, str) else prepared_password
            salt = bcrypt.gensalt(rounds=12)
            return bcrypt.hashpw(prepared_bytes, salt).decode('utf-8')
        raise


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt


def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    """Authenticate a user by email and password"""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    if not user.is_active:
        return None
    return user


def get_current_user(
    credentials: HTTPBasicCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Get the current authenticated user from HTTP Basic Auth (email-password)"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Basic"},
    )
    
    # Authenticate user with email (username) and password
    user = authenticate_user(db, credentials.username, credentials.password)
    if user is None:
        raise credentials_exception
    
    return user


def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Get the current active user"""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    return current_user


def get_current_user_from_token(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: Session = Depends(get_db)
) -> User:
    """Get the current authenticated user from JWT Bearer token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    if credentials is None:
        raise credentials_exception
    
    try:
        token = credentials.credentials
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError as e:
        # Log the error for debugging
        logging.error(f"JWT validation error: {str(e)}")
        raise credentials_exception
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    
    return user


def get_current_active_user_from_token(
    current_user: User = Depends(get_current_user_from_token)
) -> User:
    """Get the current active user from JWT Bearer token"""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    return current_user

