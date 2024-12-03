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
students_collection = db["students"]


def get_course_from_student(student_name: str, course_name: str):
    student = students_collection.find_one({"name": student_name})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    course = next((course for course in student.get("courses", []) if course["course_name"] == course_name), None)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found for the student")

    return course

def student_to_dict(student):
    return {
        "_id": str(student["_id"]),
        "name": student["name"],
        "group": student["group"],
        "courses": student["courses"],
        "tasks": student.get("tasks", [])
    }

@router.get("/students")
async def get_students():
    try:
        students_cursor = students_collection.find({})
        students = list(students_cursor)
        
        for student in students:
            student["_id"] = str(student["_id"])
            # Об'єднуємо всі завдання з усіх курсів
            student["tasks"] = [
                task
                for course in student.get("courses", [])
                for task in course.get("tasks", [])
            ]
        
        return students
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/student/{student_name}/course/{course_name}/avg")
def get_student_avg(student_name: str, course_name: str):
    course = get_course_from_student(student_name, course_name)

    total_grade = 0
    total_tasks = len(course.get("tasks", []))

    for task in course.get("tasks", []):
        total_grade += task.get("PercentageScore", 0)

    average_grade = total_grade / total_tasks if total_tasks > 0 else 0

    return {"average": average_grade}


@router.get("/group/course/{course_name}/avg")
def get_group_avg(course_name: str):
    students = students_collection.find({"courses.course_name": course_name})
    students = list(students)

    if not students:
        raise HTTPException(status_code=404, detail="No students found for this course")

    total_grade = 0
    total_tasks = 0
    for student in students:
        for course in student.get("courses", []):
            if course["course_name"] == course_name:
                for task in course.get("tasks", []):
                    total_grade += task.get("PercentageScore", 0)
                    total_tasks += 1

    if total_tasks == 0:
        raise HTTPException(status_code=404, detail="No tasks found for the students in this course")

    return {"average": total_grade / total_tasks}


@router.get("/compare/student/{student_name}/course/{course_name}")
def compare_student_group_avg(student_name: str, course_name: str):
    student = students_collection.find_one({"name": student_name})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    course = next((course for course in student.get("courses", []) if course["course_name"] == course_name), None)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found for the student")

    tasks = course.get("tasks", [])
    if not tasks:
        raise HTTPException(status_code=404, detail="No tasks found for the student in this course")

    student_avg = sum(task.get("PercentageScore", 0) for task in tasks) / len(tasks)

    students = students_collection.find({"courses.course_name": course_name})
    students = list(students)

    if not students:
        raise HTTPException(status_code=404, detail="No students found for this course")

    total_grade = 0
    total_tasks = 0
    for student in students:
        for course in student.get("courses", []):
            if course["course_name"] == course_name:
                for task in course.get("tasks", []):
                    total_grade += task.get("PercentageScore", 0)
                    total_tasks += 1

    if total_tasks == 0:
        raise HTTPException(status_code=404, detail="Cannot calculate the group average grade")

    group_avg = total_grade / total_tasks
    difference_percent = round(abs(student_avg - group_avg) / group_avg * 100, 2)

    comparison = "high" if student_avg > group_avg else "low" if student_avg < group_avg else "equal"

    return {
        "student_avg": student_avg,
        "group_avg": group_avg,
        "difference_percent": difference_percent,
        "comparison": comparison,
    }


@router.get("/compare/task/student/{student_name}/course/{course_name}/task/{TaskName}")
def compare_task_avg(student_name: str, course_name: str, task_name: str):
    student = students_collection.find_one({"name": student_name})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    course = next((course for course in student.get("courses", []) if course["course_name"] == course_name), None)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found for the student")

    task = next((task for task in course.get("tasks", []) if task["TaskName"] == task_name), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found for the student")

    student_task_grade = task.get("PercentageScore", 0)

    students = students_collection.find({"courses.course_name": course_name})
    students = list(students)

    if not students:
        raise HTTPException(status_code=404, detail="No students found for this course")

    total_grade = 0
    total_students = 0

    for student in students:
        for course in student.get("courses", []):
            if course["course_name"] == course_name:
                task = next((task for task in course.get("tasks", []) if task["TaskName"] == task_name), None)
                if task:
                    total_grade += task.get("PercentageScore", 0)
                    total_students += 1

    group_task_avg = total_grade / total_students if total_students > 0 else 0
    difference = (student_task_grade - group_task_avg) / group_task_avg * 100 if group_task_avg else 0

    return {
        "student_task_grade": student_task_grade,
        "group_task_avg": group_task_avg,
        "difference_percent": round(difference, 2),
    }


@router.get("/tasks/student/{student_name}/course/{course_name}")
def get_all_tasks(student_name: str, course_name: str):
    student = students_collection.find_one({"name": student_name})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    course = next((course for course in student.get("courses", []) if course["course_name"] == course_name), None)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found for the student")

    tasks = course.get("tasks", [])
    if not tasks:
        raise HTTPException(status_code=404, detail="No tasks found for the student in this course")

    formatted_tasks = [
        {
            "TaskName": task.get("TaskName", "Unnamed Task"),
            "Code": task.get("Code", "None"),
            "TasksCompleted": task.get("TasksCompleted", 0),
            "Attempts": task.get("Attempts", 0),
            "Errors": task.get("Errors", 0),
            "PercentageScore": f"{task.get('PercentageScore', 0)}%",
            "TimeSpent": f"{task.get('TimeSpent', 0.0)}",
            "Deadline": task.get("Deadline", "Unknown"),
            "ProgrammingLanguage": task.get("ProgrammingLanguage", "Unknown"),
            "TaskCategory": task.get("TaskCategory", "Uncategorized"),
            "AverageCompletionTime": f"{task.get('AverageCompletionTime', 0.0)}",
            "DeadlineStatus": task.get("DeadlineStatus", "unknown"),
            "SkillLevel": task.get("SkillLevel", "unknown"),
            "CodeLength": task.get("CodeLength", "None"),
        }
        for task in tasks
    ]
    return {"tasks": formatted_tasks}


def get_task_code(student_name: str, course_name: str, TaskName: str):
    student = students_collection.find_one({"name": student_name})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    course = next((course for course in student.get("courses", []) if course["course_name"] == course_name), None)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found for the student")

    task = next((task for task in course.get("tasks", []) if task["TaskName"] == TaskName), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found for the student")
    
    return task.get("Code", "No Code Available")

def get_language(student_name: str, course_name: str, TaskName: str):
    student = students_collection.find_one({"name": student_name})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    course = next((course for course in student.get("courses", []) if course["course_name"] == course_name), None)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found for the student")

    task = next((task for task in course.get("tasks", []) if task["TaskName"] == TaskName), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found for the student")
    
    return task.get("ProgrammingLanguage", "No ProgrammingLanguage Available")