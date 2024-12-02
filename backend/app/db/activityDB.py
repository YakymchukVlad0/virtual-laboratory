import random
import os
from datetime import datetime, timedelta
from bson import ObjectId
from dotenv import load_dotenv
from pymongo import MongoClient

# Завантажуємо змінні середовища
load_dotenv(".env.sample")

# Отримуємо підключення до MongoDB
uri = os.getenv("MONGO_URI", "mongodb+srv://student:1111@sac.p3bc7.mongodb.net/?retryWrites=true&w=majority&appName=SAC")
client = MongoClient(uri)

# Вибір бази даних та колекцій
db = client["SAC"]
users_collection = db["users"]
activities_collection = db["users_activity"]
# Перелік баз даних
print(client.list_database_names())

# Перелік колекцій у базі SAC
print(db.list_collection_names())
users = list(users_collection.find())
print(f"Found {len(users)} users in the database.")
# Функція для генерації випадкових даних
def generate_user_activity(users_collection, activities_collection):
    # Отримуємо список користувачів
    users = users_collection.find()
    
    # Генерація даних активності для кожного користувача
    for user in users:
        user_id = user["_id"]  # Отримуємо user_id
        for _ in range(50):  # Генеруємо активність на 30 днів
            visit_date = datetime.now() - timedelta(days=random.randint(0, 45))  # Випадкова дата в межах останнього місяця
            duration = random.randint(300, 3600)  # Випадкова тривалість сесії від 10 хвилин до 2 годин

            # Записуємо активність в колекцію
            activities_collection.insert_one({
                "user_id": user_id,
                "visit_date": visit_date,
                "duration": duration
            })

            print(f"Generated activity for user {user_id} on {visit_date} for {duration} seconds.")

# Генерація даних
generate_user_activity(users_collection, activities_collection)
