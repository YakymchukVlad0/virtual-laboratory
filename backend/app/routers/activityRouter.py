from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict
from pydantic import BaseModel
from bson import ObjectId
from .authRouter import get_current_user  # Імпорт аутентифікації
from datetime import datetime
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Завантаження змінних середовища
load_dotenv(".env.sample")

# Підключення до MongoDB
uri = os.getenv(
    "MONGO_URI", 
    "mongodb+srv://student:1111@sac.p3bc7.mongodb.net/?retryWrites=true&w=majority&appName=SAC"
)
client = AsyncIOMotorClient(uri)

# Вибір бази даних і колекцій
db = client["SAC"]
users_collection = db["users"]
activities_collection = db["users_activity"]

# Моделі для відповіді
class ActivityRecord(BaseModel):
    date: str  # Дата активності
    duration: int  # Час активності у хвилинах

class TotalTimeResponse(BaseModel):
    total_hours: int
    total_minutes: int
    stats: List[ActivityRecord]

# Ініціалізація маршрутизатора
activityRouter = APIRouter()

# Допоміжна функція для отримання активності
async def get_activity_data(start_date: datetime, end_date: datetime, user_id: str) -> List[Dict]:
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID format")

    # Отримання даних з MongoDB
    cursor = activities_collection.find({
        "user_id": ObjectId(user_id),
        "visit_date": {"$gte": start_date, "$lt": end_date}
    })
    
    # Формування списку активностей
    activity_records = []
    async for record in cursor:
        activity_records.append({
            "date": record["visit_date"].strftime("%Y-%m-%d"),
            "duration": record["duration"] // 60  # Перетворення секунд у хвилини
        })
    
    return activity_records

# Маршрут для отримання статистики
@activityRouter.get("/stats", response_model=TotalTimeResponse)
async def get_activity_stats(start_date: str, end_date: str, current_user: dict = Depends(get_current_user)):
    """
    Отримання статистики активності користувача
    """
    print(f"Received start_date: {start_date}, end_date: {end_date}, current_user: {current_user}")
    # Валідація діапазону дат
    try:
        start_date_obj = datetime.strptime(start_date, "%Y-%m-%d")
        end_date_obj = datetime.strptime(end_date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

    # Отримання ID користувача
    user_id = current_user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID not found in the current user data.")

    # Отримання даних активності
    activity_records = await get_activity_data(start_date_obj, end_date_obj, user_id)

    # Підсумовування часу
    total_minutes = sum(record["duration"] for record in activity_records)
    total_hours = total_minutes // 60
    total_minutes = total_minutes % 60

    return TotalTimeResponse(
        total_hours=total_hours,
        total_minutes=total_minutes,
        stats=activity_records
    )
