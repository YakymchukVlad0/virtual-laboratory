import uvicorn

from fastapi import FastAPI

from app.routers.router import router
from app.routers.authRouter import auth_router

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(router)
app.include_router(auth_router, prefix="/auth", tags=["auth"])


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"]
)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8001)
