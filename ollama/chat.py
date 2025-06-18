from llm import mistral



def generate_questions(questions: str) -> list[str]:
    prompt = f'Lag noen spørsmål basert på dette: {questions}'
    questions = mistral.prompt_mistral(prompt)
    print(questions)
    questions = questions.split("?")
    questions = [q.strip() + "?" for q in questions if q.strip()]

    return questions
