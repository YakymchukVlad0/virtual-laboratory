import os
import openai
from dotenv import load_dotenv

load_dotenv(".env.sample")

KEY = os.getenv("AI_KEY")


openai.api_key = KEY

def GenerateReport(Data):
    try:
        response = openai.chat.completions.create(
            model="gpt-4o-mini-2024-07-18",
            messages=[{"role": "user", "content": Data}],
            max_tokens=300,
            temperature=0.4,
            n=1,
            stop=None,
            timeout=15
        )
 
        print("API response:", response)

        if response and response.choices:
            return response.choices[0].message.content.strip()
        else:
            return None
    except Exception as e:
        return f"Error: {str(e)}"
