from fastapi import APIRouter, Depends, HTTPException
from ..reports.report_collect import download_reports
from ..reports.complexity_report import create_reports_for_student

analyticsRouter = APIRouter()

@analyticsRouter.get("/reports")
async def get_reports(username: str):
    create_reports_for_student(username, "Developing")
    reports = download_reports(username, "Developing")
    return {"reports": reports}