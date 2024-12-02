from fastapi import APIRouter, Depends, HTTPException
from ..reports.report_collect import download_reports
from ..reports.complexity_report import create_reports_for_student
from typing import Dict, Any
import os
from pydantic import BaseModel
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from fastapi.responses import FileResponse


analyticsRouter = APIRouter()

@analyticsRouter.get("/reports")
async def get_reports(username: str):
    create_reports_for_student(username, "Developing")
    reports = download_reports(username, "Developing")
    return {"reports": reports}




# Допоміжна функція для відображення тексту з переносом
def draw_wrapped_text(c, text, x, y, max_width, font="Helvetica", font_size=10, line_spacing=12):
    c.setFont(font, font_size)
    lines = text.split("\n")
    current_y = y

    for line in lines:
        words = line.split()
        current_line = ""

        for word in words:
            test_line = f"{current_line} {word}".strip()
            if c.stringWidth(test_line, font, font_size) < max_width:
                current_line = test_line
            else:
                c.drawString(x, current_y, current_line)
                current_y -= line_spacing
                current_line = word

        if current_line:
            c.drawString(x, current_y, current_line)
            current_y -= line_spacing

    return current_y

# Функція для створення PDF
def create_pdf_from_report(report: Dict[str, Any], output_path: str):
    c = canvas.Canvas(output_path, pagesize=letter)
    width, height = letter

    # Заголовок
    c.setFont("Helvetica-Bold", 16)
    title = "Code Complexity Report"
    student_name = f"Student: {report.get('student_name', 'N/A')}"
    task_line = f"Task: {report.get('task_number', 'N/A')}"
    course = f"Course: {report.get('course', 'N/A')}"
    language = f"Language: {report.get('language', 'N/A')}"

    # Центрування заголовків
    c.drawString((width - c.stringWidth(title, "Helvetica-Bold", 16)) / 2, height - 50, title)
    c.setFont("Helvetica", 12)
    c.drawString(40, height - 80, student_name)
    c.drawString(40, height - 100, task_line)
    c.drawString(40, height - 120, course)
    c.drawString(40, height - 140, language)

    # Параметри для тексту
    margin_left = 40
    margin_right = width - 40
    max_width = margin_right - margin_left
    current_y = height - 160

    # Statistics
    c.setFont("Helvetica-Bold", 12)
    c.drawString(margin_left, current_y, "Statistics:")
    current_y -= 20
    statistics = report.get("statistics", {})
    statistics_text = "\n".join([f"- {key}: {value}" for key, value in statistics.items()])
    current_y = draw_wrapped_text(c, statistics_text, margin_left, current_y, max_width, line_spacing=15)
    current_y -= 20

    # Notes
    c.setFont("Helvetica-Bold", 12)
    c.drawString(margin_left, current_y, "Notes:")
    current_y -= 20
    notes = "\n".join(report.get("notes", []))
    current_y = draw_wrapped_text(c, notes, margin_left, current_y, max_width, line_spacing=15)
    current_y -= 20

    # General Comments
    c.setFont("Helvetica-Bold", 12)
    c.drawString(margin_left, current_y, "General Comments:")
    current_y -= 20
    general_comments = "\n".join(report.get("general_comment", []))
    current_y = draw_wrapped_text(c, general_comments, margin_left, current_y, max_width, line_spacing=15)

    # Complexity Rating
    evaluation = report.get("evaluation", "N/A")
    c.setFont("Helvetica-Bold", 12)
    c.drawString(width - 200, 40, f"Complexity Rating: {evaluation} / 20")

    c.save()

# API модель
class ReportRequest(BaseModel):
    username: str
    report: Dict[str, Any]

@analyticsRouter.post("/download")
async def download_report(data: ReportRequest):
    report = data.report
    report_filename = f"{report['task_number']}_report.pdf"
    report_path = f"reports/{report_filename}"

    # Перевіряємо, чи існує директорія
    os.makedirs("reports", exist_ok=True)

    # Генерація PDF
    try:
        create_pdf_from_report(report, report_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate report: {e}")

    # Перевірка, чи файл створений
    if not os.path.exists(report_path):
        raise HTTPException(status_code=500, detail="Failed to generate report")

    return FileResponse(path=report_path, filename=report_filename, media_type="application/pdf")