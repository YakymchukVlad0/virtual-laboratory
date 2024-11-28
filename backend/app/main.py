from fastapi.routing import APIRoute
import uvicorn

from fastapi import FastAPI

from app.routers.router import router
from app.routers.authRouter import authRouter

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",  # Додайте домен вашого клієнта
    "http://127.0.0.1:5173",  # Якщо клієнт працює на іншій адресі
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Список дозволених доменів
    allow_credentials=True,
    allow_methods=["*"],  # Дозволяємо всі методи (GET, POST, PUT тощо)
    allow_headers=["*"],  # Дозволяємо всі заголовки
)

@app.on_event("startup")
async def list_routes():
    for route in app.router.routes:
        if isinstance(route, APIRoute):
            print(f"{route.path} -> {route.methods}")
            
app.include_router(router)
app.include_router(authRouter, prefix="/auth", tags=["auth"])



if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8001)
