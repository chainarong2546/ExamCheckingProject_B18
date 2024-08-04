from fastapi import FastAPI
from .router.api import router

app = FastAPI()



app.include_router(router, prefix="/api")
