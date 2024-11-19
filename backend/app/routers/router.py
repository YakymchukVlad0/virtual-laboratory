import os

from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

router = APIRouter()

load_dotenv()

uri = os.getenv("MONGO_URI")
client = MongoClient(uri)

db = client["SAC"]
students_collection = db["students"]
courses_collection = db["courses"]


def get_course_id(course_name: str):
    course = courses_collection.find_one({"course_name": course_name})
    return course["_id"] if course else None


@router.get("/student/{student_name}/course/{course_name}/avg")
def get_student_avg(student_name: str, course_name: str):
    course_id = get_course_id(course_name)
    if not course_id:
        raise HTTPException(status_code=404, detail="Course not found")

    student = students_collection.find_one({"name": student_name, "courses.course_id": course_id})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found or not enrolled to the course")

    course = next((course for course in student["courses"] if course["course_id"] == course_id), None)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found for the student")

    total_grade = 0
    total_tasks = 0
    for task in course.get("tasks", []):
        total_grade += task["submission"]["grade"]
        total_tasks += 1

    return {"average": total_grade / total_tasks if total_tasks > 0 else 0}


@router.get("/group/course/{course_name}/avg")
def get_group_avg(course_name: str):
    course_id = get_course_id(course_name)
    if not course_id:
        raise HTTPException(status_code=404, detail="Course not found")

    students = students_collection.find({"courses.course_id": course_id})
    students = list(students)  # Перетворення курсору в список

    if not students:
        raise HTTPException(status_code=404, detail="No students found for this course")

    total_grade = 0
    total_tasks = 0
    for student in students:
        for course in student["courses"]:
            if course["course_id"] == course_id:
                for task in course.get("tasks", []):
                    total_grade += task["submission"]["grade"]
                    total_tasks += 1

    if total_tasks == 0:
        raise HTTPException(status_code=404, detail="No tasks found for the students in this course")

    return {"average": total_grade / total_tasks}


@router.get("/compare/student/{student_name}/course/{course_name}")
def compare_student_group_avg(student_name: str, course_name: str):
    course_id = get_course_id(course_name)
    if not course_id:
        raise HTTPException(status_code=404, detail="Course not found")

    student = students_collection.find_one({"name": student_name, "courses.course_id": course_id})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found or not enrolled to the course")

    course = next((course for course in student["courses"] if course["course_id"] == course_id), None)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found for the student")

    student_avg = sum(task["submission"]["grade"] for task in course.get("tasks", [])) / len(course["tasks"])

    students = students_collection.find({"courses.course_id": course_id})
    students = list(students)

    if not students:
        raise HTTPException(status_code=404, detail="No students found for this course")

    total_grade = 0
    total_tasks = 0
    for student in students:
        for course in student["courses"]:
            if course["course_id"] == course_id:
                for task in course.get("tasks", []):
                    total_grade += task["submission"]["grade"]
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


@router.get("/compare/task/student/{student_name}/course/{course_name}/task/{task_name}")
def compare_task_avg(student_name: str, course_name: str, task_name: str):
    course_id = get_course_id(course_name)
    if not course_id:
        raise HTTPException(status_code=404, detail="Course not found")

    student = students_collection.find_one({"name": student_name, "courses.course_id": course_id})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found or not enrolled in this course")

    course = next((course for course in student["courses"] if course["course_id"] == course_id), None)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found for the student")

    task = next((task for task in course.get("tasks", []) if task["task_name"] == task_name), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    student_task_grade = task["submission"]["grade"]
    total_grade = 0
    total_students = 0

    for student in students_collection.find({"courses.course_id": course_id}):
        course = next((course for course in student["courses"] if course["course_id"] == course_id), None)
        if course:
            task = next((task for task in course.get("tasks", []) if task["task_name"] == task_name), None)
            if task:
                total_grade += task["submission"]["grade"]
                total_students += 1

    group_task_avg = total_grade / total_students if total_students > 0 else 0
    difference = (student_task_grade - group_task_avg) / group_task_avg * 100 if group_task_avg else 0

    return {
        "student_task_grade": student_task_grade,
        "group_task_avg": group_task_avg,
        "difference_percent": round(difference, 2),
    }
