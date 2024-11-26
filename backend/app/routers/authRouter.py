import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError
import jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional
from uuid import uuid4

load_dotenv(".env.sample")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
authRouter = FastAPI()
uri = os.getenv("MONGO_DB_PATH")
client = MongoClient(uri)


db = client["SAC"]
users_collection = db["users"]

class User(BaseModel):
    id: str
    email: EmailStr
    username: str
    hashed_password: str

class UserRegister(BaseModel):
    email: EmailStr
    username: str
    password: str

SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Хелпери
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(email: str):
    return db.get(email)

# Реєстрація
@authRouter.post("/auth/register")
async def register(user: UserRegister):
    if user.email in db:
        raise HTTPException(status_code=400, detail="User already exists")
    hashed_password = get_password_hash(user.password)
    new_user = User(
        id=str(uuid4()),
        email=user.email,
        username=user.username,
        hashed_password=hashed_password,
    )
    db[user.email] = new_user
    return {"message": "User registered successfully"}

# Логін
@authRouter.post("/auth/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = get_user(form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(data={"sub": user.email})
    return {"access_token": token, "token_type": "bearer", "username": user.username}

# Перевірка токена
@authRouter.get("/auth/me")
async def get_me(token: str = Depends(OAuth2PasswordRequestForm)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        user = get_user(email)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"username": user.username, "email": user.email}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")