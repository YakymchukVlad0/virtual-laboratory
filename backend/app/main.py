import uvicorn

from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def test_func():
    response = {"message": "Hello World"}
    return response


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8001)