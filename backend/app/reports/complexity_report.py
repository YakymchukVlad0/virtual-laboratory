from reportlab.lib.pagesizes import letter

from reportlab.pdfgen import canvas

from .openAI import GenerateReport
import re
import sys
import os
from .report_collect import upload_report, check_ready_report, delete_report



sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))

from backend.app.routers.router import get_task_code, get_language, count_tasks



def AnalyzeCodeComplexity(code):
    try:
        prompt = (
            "Analyze the following code and provide a structured report on its complexity. "
            "Evaluate: loops, conditions, redundant operators, function duplication, and potential improvements. "
            "Please respond in the following format:\n"
            "1. **Complexity Rating** (0-20): [Provide only a numeric rating on the complexity of the code, calculated as (20 - total number of objects in the statistics)]"
            " The fewer the objects in the statistics (e.g., loops, conditions, duplications, redundant operators), the higher the complexity rating."
            " The more the objects, the lower the complexity rating."
            " The complexity rating is based on the formula: **20 - (total sum of all issues in statistics)**. A higher complexity rating indicates more efficient code with fewer issues."
            "2. **Statistics**:\n"
            " Number of loops: [Number of loops in the code]\n"
            " Number of conditions: [Number of conditional statements]\n"
            " Number of function duplications: [Count of duplicated functions]\n"
            " Number of redundant operators: [Number of redundant operators]\n"
            "3. **Notes**: [Provide key observations and any important notes related to the code]\n"
            "4. **General Comments**: [Provide any general comments about the code, including potential improvements, performance considerations, etc.]\n"
            "Code:\n"
            f"```python\n{code}\n```"
        )

        # Імітація результату аналізу
        analysis_result = GenerateReport(prompt)

        # Перевірка результату
        print("Analysis Result:", analysis_result)  # Додано для перевірки результату аналізу

        blocks = analysis_result.strip().split('\n\n')

        # Ініціалізація масиву
        report = {}

        # 0: Complexity Rating
        complexity_match = re.search(r"Complexity Rating.*?:\s*(\d+)", blocks[0].replace("*", ""))
        if complexity_match:
            # Видаляємо зайві символи навколо числа
            complexity_rating = complexity_match.group(1)
            complexity_rating = re.sub(r"[^\d]", "", complexity_rating)  # Видаляємо все, окрім цифр
            report["evaluation"] = int(complexity_rating)  # Додаємо складність як число
        else:
            report["evaluation"] = "N/A"


        # 1: Statistics
        statistics = {}
        if len(blocks) > 1:
            statistics_lines = blocks[1].split('\n')[1:]  # Пропускаємо перший рядок (заголовок)
            for line in statistics_lines:
                match = re.search(r"-\s*(.*?):\s*(\d+)", line.strip())
                if match:
                    # Очищаємо число від зайвих символів
                    stat_value = match.group(2)
                    stat_value = re.sub(r"[^\d]", "", stat_value)  # Видаляємо все, окрім цифр
                    statistics[match.group(1)] = int(stat_value)  # Зберігаємо статистику як числа
        report["statistics"] = statistics

        # 2: Notes
        notes = []
        if len(blocks) > 2:
            notes_lines = blocks[2].split('\n')[1:]  # Пропускаємо перший рядок (заголовок)
            for line in notes_lines:
                cleaned_line = line.strip().replace("**", "").lstrip("- ")  # Видаляємо "- " з початку рядка
                notes.append(cleaned_line)
        report["notes"] = notes

        # 3: General Comments
        general_comments = []
        if len(blocks) > 3:
            general_comment_lines = blocks[3].split('\n')[1:]  # Пропускаємо перший рядок (заголовок)
            for line in general_comment_lines:
                cleaned_line = line.strip().replace("**", "").lstrip("- ")  # Видаляємо "- " з початку рядка
                general_comments.append(cleaned_line)
        report["general_comment"] = general_comments
        print(report)
        return report


    except Exception as e:
        return {"error": str(e)}

# Функція для виведення тексту з автоматичним перенесенням
def draw_wrapped_text(c, text, x, y, max_width, font="Helvetica", font_size=10, line_spacing=12):
    c.setFont(font, font_size)
    lines = text.split("\n")
    current_y = y

    for line in lines:
        # Розбиваємо текст на частини, щоб кожен рядок не виходив за межі
        words = line.split()
        current_line = ""
        
        for word in words:
            # Додаємо слово до поточного рядка
            test_line = f"{current_line} {word}".strip()
            # Якщо новий рядок не вміщається в max_width, перенести на новий рядок
            if c.stringWidth(test_line, font, font_size) < max_width:
                current_line = test_line
            else:
                # Додаємо поточний рядок та переносимо на новий рядок
                c.drawString(x, current_y, current_line)
                current_y -= line_spacing  # Збільшуємо відстань між рядками
                current_line = word  # Починаємо новий рядок з поточного слова

        # Виводимо останній рядок
        if current_line:
            c.drawString(x, current_y, current_line)
            current_y -= line_spacing  # Збільшуємо відстань між рядками

    return current_y  # Повертаємо нову висоту для наступного елемента

# Створення PDF звіту
def create_pdf(report, student_group, task_number, output_filename="code_complexity_report.pdf"):
    c = canvas.Canvas(output_filename, pagesize=letter)
    width, height = letter

    # Заголовок
    c.setFont("Helvetica-Bold", 16)
    title = "Code Complexity Report"
    student_line = f"Student {student_group}"
    task_line = f"Task #{task_number}"

    # Центрування заголовка
    c.drawString((width - c.stringWidth(title, "Helvetica-Bold", 16)) / 2, height - 50, title)
    c.setFont("Helvetica", 12)
    c.drawString((width - c.stringWidth(student_line, "Helvetica", 12)) / 2, height - 80, student_line)
    c.drawString((width - c.stringWidth(task_line, "Helvetica", 12)) / 2, height - 110, task_line)

    # Параметри для розміщення тексту
    c.setFont("Helvetica", 10)
    margin_left = 40  # Відступ зліва
    margin_right = width - 40  # Відступ справа
    max_width = margin_right - margin_left  # Ширина, до якої текст буде переноситись

    # Виведення Statistics
    c.setFont("Helvetica-Bold", 12)
    c.drawString(margin_left, height - 150, "Statistics:")
    current_y = height - 170  # Збільшено відступ між заголовком і текстом
    statistics = report.get("statistics", {})
    statistics_text = "\n".join([f"- {key}: {value}" for key, value in statistics.items()])
    current_y = draw_wrapped_text(c, statistics_text, margin_left, current_y, max_width, line_spacing=15)
    current_y -= 20  # Додаємо відступ між секціями

    # Виведення Notes
    c.setFont("Helvetica-Bold", 12)
    c.drawString(margin_left, current_y - 10, "Notes:")
    current_y -= 30  # Збільшено відступ між заголовком і текстом
    notes = report.get("notes", [])
    notes_text = "\n".join(notes)
    current_y = draw_wrapped_text(c, notes_text, margin_left, current_y, max_width, line_spacing=15)
    current_y -= 20  # Додаємо відступ між секціями

    # Виведення General Comments
    c.setFont("Helvetica-Bold", 12)
    c.drawString(margin_left, current_y - 10, "General Comment:")
    current_y -= 30  # Збільшено відступ між заголовком і текстом
    general_comments = report.get("general_comment", [])
    general_comments_text = "\n".join(general_comments)
    current_y = draw_wrapped_text(c, general_comments_text, margin_left, current_y, max_width, line_spacing=15)

    # Виведення Complexity Rating в правому нижньому кутку
    complexity_rating = report.get('evaluation', 'N/A')
    c.setFont("Helvetica-Bold", 12)
    c.drawString(width - 200, 40, f"Complexity Rating: {complexity_rating} /20")

    c.save()





def create_reports_for_student(StudentName, CourseName):
    total_tasks = count_tasks(StudentName, CourseName)
    print(f"Total tasks: {total_tasks}")
    for number in range(0, total_tasks):
        task_number = f"Task {number + 1}"
        print(f"Processing {task_number}")
        if check_ready_report(StudentName, task_number, CourseName):
            print("Звіт для цього коду вже існує")
            continue
 
        code = get_task_code(StudentName, CourseName, task_number)
        print(f"Code for {task_number}: {code}")
        language = get_language(StudentName, CourseName, task_number)

        if code != "None":
            report = AnalyzeCodeComplexity(code)
            upload_report(StudentName, task_number, CourseName, report, language)
        else:
            print(f"Немає коду для {task_number}")



def refresh_report(StudentName, task_number, CourseName):
    if check_ready_report(StudentName, task_number, CourseName):
        print("Цього звіту не існує")
        return
    
    delete_report(StudentName, task_number, CourseName)

    code = get_task_code(StudentName, CourseName, task_number)
    language = get_language(StudentName, CourseName, task_number)
    if code != "None":
        report = AnalyzeCodeComplexity(code)
        upload_report(StudentName, task_number, CourseName, report, language)
    else:
        print(f"Немає коду для {task_number}")

create_reports_for_student("Oleksandr Vasyliv", "Developing")