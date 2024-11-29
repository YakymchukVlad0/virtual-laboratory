import logging
import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends, APIRouter
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError
import jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional
from bson import ObjectId


load_dotenv(".env.sample")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
authRouter =APIRouter()
uri = os.getenv("MONGO_DB_PATH")
client = AsyncIOMotorClient(uri)


logging.basicConfig(level=logging.INFO)

db = client["SAC"]
users_collection = db["users"]
activities_collection = db["users_activity"]
SECRET_KEY = "mysecretkey"  # Для реальних проектів використовуйте більш складний ключ
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Створення хешованого пароля
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Моделі для даних
class UserInCreate(BaseModel):
    email: str
    username: str
    password: str

class UserInLogin(BaseModel):    
    email: str
    username: str
    password: str

class UserAfterLogin(EmailStr):
    user_id: str

class UserOut(BaseModel):
    email: str
    username: str

class Token(BaseModel):
    access_token: str
    token_type: str

def convert_object_id(document):
    if isinstance(document, dict):
        return {key: str(value) if isinstance(value, ObjectId) else value for key, value in document.items()}
    return document

# Функція для хешування пароля
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Функція для перевірки пароля
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Функція для створення токену
def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=15)) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Реєстрація нового користувача
@authRouter.post("/register", response_model=UserOut)
async def register(user: UserInCreate):
    # Перевірка, чи існує вже користувач з таким емейлом
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Хешування пароля
    hashed_password = hash_password(user.password)
    
    # Створення користувача в базі даних
    new_user = {
        "email": user.email,
        "username": user.username,
        "password": hashed_password
    }
    result = await users_collection.insert_one(new_user)
    
    # Повернення результату
    created_user = await users_collection.find_one({"_id": result.inserted_id})
    return UserOut(email=created_user["email"], username=created_user["username"])
# Логін користувача
# Функція для перетворення всіх ObjectId в рядки
def convert_objectid_to_str(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    elif isinstance(obj, dict):
        return {k: convert_objectid_to_str(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_objectid_to_str(i) for i in obj]
    else:
        return obj

# Основна функція логіну
@authRouter.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Знаходимо користувача
    user = await users_collection.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    # Генеруємо токен
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": str(user["_id"])}, expires_delta=access_token_expires)

    # Отримуємо активність користувача
    activities_cursor = activities_collection.find({"user_id": user["_id"]})
    activities = await activities_cursor.to_list(length=100)

    # Перетворюємо всі ObjectId в рядки
    user = convert_objectid_to_str(user)
    activities = convert_objectid_to_str(activities)

    # Повертаємо відповідь
    return {
        "user": {
            "id": str(user["_id"]),
            "username": user["username"],
            "email": user["email"],
        },
        "activities": activities,
        "access_token": access_token
    }
@authRouter.options("/login")
async def options_handler():
    response = JSONResponse(content={})
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"
    response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

# Декоратор для перевірки токену (обробник запитів з токеном)
def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")  # "sub" зберігає user_id
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"user_id": user_id}  # Повертаємо тільки ID користувача
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token2")

# Захищений маршрут для отримання даних користувача
@authRouter.get("/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    user = await users_collection.find_one({"_id": ObjectId(user_id)})  # Пошук у базі
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "user_id": str(user["_id"]),
        "username": user["username"],
        "email": user["email"]
    }