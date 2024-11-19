from fastapi.testclient import TestClient
from unittest.mock import patch
from app.main import app

client = TestClient(app)


@patch("app.routers.router.students_collection.find_one")
@patch("app.routers.router.courses_collection.find_one")
def test_get_student_avg(mock_course_find_one, mock_student_find_one):
    mock_course_find_one.return_value = {"_id": "course1"}
    mock_student_find_one.return_value = {
        "name": "John",
        "courses": [
            {
                "course_id": "course1",
                "tasks": [
                    {"submission": {"grade": 90}},
                    {"submission": {"grade": 80}},
                ],
            }
        ],
    }

    response = client.get("/student/John/course/Math/avg")
    assert response.status_code == 200
    assert response.json() == {"average": 85.0}


@patch("app.routers.router.students_collection.find")
@patch("app.routers.router.courses_collection.find_one")
def test_get_group_avg(mock_course_find_one, mock_students_find):
    mock_course_find_one.return_value = {"_id": "course1"}
    mock_students_find.return_value = [
        {"courses": [{"course_id": "course1", "tasks": [{"submission": {"grade": 80}}]}]},
        {"courses": [{"course_id": "course1", "tasks": [{"submission": {"grade": 90}}]}]},
    ]

    response = client.get("/group/course/Math/avg")
    assert response.status_code == 200
    assert response.json() == {"average": 85.0}


@patch("app.routers.router.students_collection.find")
@patch("app.routers.router.students_collection.find_one")
@patch("app.routers.router.courses_collection.find_one")
def test_compare_student_group_avg(mock_course_find_one, mock_student_find_one, mock_students_find):
    mock_course_find_one.return_value = {"_id": "course1"}
    mock_student_find_one.return_value = {
        "name": "John",
        "courses": [
            {
                "course_id": "course1",
                "tasks": [
                    {"submission": {"grade": 90}},
                    {"submission": {"grade": 80}},
                ],
            }
        ],
    }
    mock_students_find.return_value = [
        {"courses": [{"course_id": "course1", "tasks": [{"submission": {"grade": 70}}]}]},
        {"courses": [{"course_id": "course1", "tasks": [{"submission": {"grade": 80}}]}]},
    ]

    response = client.get("/compare/student/John/course/Math")
    assert response.status_code == 200
    assert response.json() == {
        "student_avg": 85.0,
        "group_avg": 75.0,
        "difference_percent": 13.33,
        "comparison": "high",
    }


@patch("app.routers.router.courses_collection.find_one")
def test_course_not_found(mock_course_find_one):
    mock_course_find_one.return_value = None

    response = client.get("/student/John/course/UnknownCourse/avg")
    assert response.status_code == 404
    assert response.json() == {"detail": "Course not found"}


@patch("app.routers.router.students_collection.find")
@patch("app.routers.router.students_collection.find_one")
@patch("app.routers.router.courses_collection.find_one")
def test_compare_task_avg(mock_course_find_one, mock_student_find_one, mock_students_find):
    mock_course_find_one.return_value = {"_id": "course1"}
    mock_student_find_one.return_value = {
        "name": "John",
        "courses": [
            {
                "course_id": "course1",
                "tasks": [
                    {"task_name": "Task1", "submission": {"grade": 95}},
                ],
            }
        ],
    }
    mock_students_find.return_value = [
        {"courses": [{"course_id": "course1", "tasks": [{"task_name": "Task1", "submission": {"grade": 85}}]}]},
        {"courses": [{"course_id": "course1", "tasks": [{"task_name": "Task1", "submission": {"grade": 75}}]}]},
    ]

    response = client.get("/compare/task/student/John/course/Math/task/Task1")
    assert response.status_code == 200
    assert response.json() == {
        "student_task_grade": 95,
        "group_task_avg": 80.0,
        "difference_percent": 18.75,
    }


@patch("app.routers.router.students_collection.find_one")
@patch("app.routers.router.courses_collection.find_one")
def test_get_student_not_found(mock_course_find_one, mock_student_find_one):
    mock_course_find_one.return_value = {"_id": "course1"}
    mock_student_find_one.return_value = None

    response = client.get("/student/NonExistentStudent/course/Math/avg")
    assert response.status_code == 404
    assert response.json() == {"detail": "Student not found or not enrolled to the course"}


@patch("app.routers.router.students_collection.find")
@patch("app.routers.router.courses_collection.find_one")
def test_get_group_avg_no_students(mock_course_find_one, mock_students_find):
    mock_course_find_one.return_value = {"_id": "course1"}
    mock_students_find.return_value = []

    response = client.get("/group/course/Math/avg")
    assert response.status_code == 404
    assert response.json() == {"detail": "No students found for this course"}


@patch("app.routers.router.students_collection.find_one")
@patch("app.routers.router.courses_collection.find_one")
def test_compare_student_group_avg_no_group_avg(mock_course_find_one, mock_student_find_one):
    mock_course_find_one.return_value = {"_id": "course1"}
    mock_student_find_one.return_value = {
        "name": "John",
        "courses": [
            {
                "course_id": "course1",
                "tasks": [
                    {"submission": {"grade": 90}},
                    {"submission": {"grade": 80}},
                ],
            }
        ],
    }

    response = client.get("/compare/student/John/course/Math")
    assert response.status_code == 404
    assert response.json() == {"detail": "No students found for this course"}


@patch("app.routers.router.students_collection.find_one")
@patch("app.routers.router.courses_collection.find_one")
def test_compare_task_avg_no_task_found(mock_course_find_one, mock_student_find_one):
    mock_course_find_one.return_value = {"_id": "course1"}
    mock_student_find_one.return_value = {
        "name": "John",
        "courses": [
            {
                "course_id": "course1",
                "tasks": [
                    {"task_name": "Task1", "submission": {"grade": 95}},
                ],
            }
        ],
    }

    response = client.get("/compare/task/student/John/course/Math/task/NonExistentTask")
    assert response.status_code == 404
    assert response.json() == {"detail": "Task not found"}


@patch("app.routers.router.students_collection.find")
@patch("app.routers.router.courses_collection.find_one")
def test_get_group_avg_no_tasks(mock_course_find_one, mock_students_find):
    mock_course_find_one.return_value = {"_id": "course1"}
    mock_students_find.return_value = [
        {"courses": [{"course_id": "course1", "tasks": []}]}
    ]

    response = client.get("/group/course/Math/avg")
    assert response.status_code == 404
    assert response.json() == {"detail": "No tasks found for the students in this course"}
