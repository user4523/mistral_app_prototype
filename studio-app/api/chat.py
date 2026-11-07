from typing import Literal

from fastapi import APIRouter
from pydantic import BaseModel
from utils.mistral import mistral_client

MODEL = "mistral-small-latest"

router = APIRouter()


class ChatMessage(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]


class ChatResponse(BaseModel):
    reply: str


@router.post("/chat", operation_id="chat", summary="Send the conversation to Mistral and return the reply")
async def chat(request: ChatRequest) -> ChatResponse:
    messages = [{"role": m.role, "content": m.content} for m in request.messages]
    completion = mistral_client().chat.complete(model=MODEL, messages=messages)
    content = completion.choices[0].message.content
    return ChatResponse(reply=content if isinstance(content, str) else str(content))
