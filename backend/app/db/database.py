import os
import random
from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

load_dotenv(".env.sample")

uri = os.getenv("MONGO_DB_PATH")
client = MongoClient(uri)

db = client["SAC"]

db.create_collection("students")

students_collection = db["students"]

group_name = "PZ-47"
course_name = "Software Architecture and Design"
students = [
    "Oleksandr", "Maria", "Dmytro", "Sofia", "Volodymyr",
    "Anastasiia", "Andrii", "Kateryna", "Ivan", "Olha",
    "Artem", "Hanna", "Mykola", "Yulia", "Taras"
]

for student_name in students:
    tasks = [
        {
            "task_name": f"Task {i + 1}",
            "code": f"# Code for Task {i + 1}",
            "grade": random.randint(1, 20)
        }
        for i in range(5)
    ]
    student_data = {
        "name": student_name,
        "group": group_name,
        "courses": [
            {
                "course_name": course_name,
                "tasks": tasks
            }
        ]
    }
    student_id = students_collection.insert_one(student_data).inserted_id
    print(f"Студент {student_name} доданий з ID: {student_id}")

print("\nЗбережені студенти:")
for student in students_collection.find():
    print(student)
