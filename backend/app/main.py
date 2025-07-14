from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import meetings
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="Meeting Scheduler Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(meetings.router)

@app.get("/")
async def root():
    return {"message": "Meeting Scheduler Backend"}