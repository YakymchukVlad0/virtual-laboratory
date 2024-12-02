import os

from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

router = APIRouter()

load_dotenv(".env.sample")

uri = "mongodb+srv://student:1111@sac.p3bc7.mongodb.net/?retryWrites=true&w=majority&appName=SAC"
client = MongoClient(uri)

db = client["SAC"]
reports_collection = db['reports']


def upload_report(student_name, task_number, course, report, language):
    try:
        # Створення документа для завантаження в MongoDB
        report_document = {
            "student_name": student_name,
            "course": course,
            "task_number": task_number,
            "language": language,
            "evaluation": report.get("evaluation", "N/A"),
            "statistics": report.get("statistics", {}),
            "notes": report.get("notes", []),
            "general_comment": report.get("general_comment", []),
        }

        # Додавання документа в колекцію
        result = reports_collection.insert_one(report_document)
        
        # Повернення успішного результату
        return {"success": f"Report for {student_name} - {task_number} saved with ID: {result.inserted_id}"}

    except Exception as e:
        return {"error": str(e)}
    
def check_ready_report(student_name, task_number, course):
    try:
        existing_report = reports_collection.find_one({
        "student_name": student_name,
        "task_number": task_number,
        "course": course
        })

        if existing_report:
            return True
        else:
            return False

    except Exception as e:
        return {"error": str(e)}
    

def delete_report(student_name, task_number, course):
    try:
        reports_collection.delete_one({
        "student_name": student_name,
        "task_number": task_number,
        "course": course
        })
    except Exception as e:
        return {"error": str(e)}
    
def count_tasks(student_name, course):
    try:
        task_count = reports_collection.count_documents({
            "student_name": student_name,
            "course": course
        })

        return (task_count+1)
    except Exception as e:
        return {"error": str(e)}
    

def download_reports(student_name, course):
    try:
        tasks = reports_collection.find({
            "student_name": student_name,
            "course": course
        })

        tasks_list = []
        for task in tasks:
            task['_id'] = str(task['_id']) 
            tasks_list.append(task)

        return tasks_list
    except Exception as e:
        return {"error": str(e)}