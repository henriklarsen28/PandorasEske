import requests
from fastapi import FastAPI, Request
from chat import generate_questions
from pydantic import BaseModel

app = FastAPI()

class ChatRequest(BaseModel):
    message: str

@app.post("/generateQuestions")
def generate_question(request: ChatRequest):
    return generate_questions(request.message)


