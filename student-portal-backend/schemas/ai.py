from pydantic import BaseModel


class AIAssistantRequest(BaseModel):
    prompt: str


class AIAssistantResponse(BaseModel):
    prompt: str
    response: str
