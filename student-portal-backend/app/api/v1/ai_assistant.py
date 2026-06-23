from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.config import settings
from models.user import User
from schemas.ai import AIAssistantRequest, AIAssistantResponse
from services.gemini_service import GeminiService

router = APIRouter()


@router.post("/", response_model=AIAssistantResponse)
async def ask_ai(
    request: AIAssistantRequest,
    current_user: User = Depends(get_current_user),
) -> AIAssistantResponse:
    assistant = GeminiService(api_key=settings.gemini_api_key)
    answer = await assistant.ask(request.prompt)
    return AIAssistantResponse(prompt=request.prompt, response=answer)
