from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.predict import predict_router
from routes.tool import tool_router

origins = [
    "https://www.exam-checking.online",
    "https://www.exam-checking.online",
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router, prefix="/predict")
app.include_router(tool_router, prefix="/tool")