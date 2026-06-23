import httpx
import logging


def _build_prompt_response(prompt: str) -> str:
    return (
        f"The AI assistant has received your prompt and is ready to help. "
        f"In a production setup, this service would route your request to an external AI provider. "
        f"You asked: {prompt}"
    )


class GeminiService:
    def __init__(self, api_key: str | None = None):
        self.api_key = api_key

    async def ask(self, prompt: str) -> str:
        cleaned = prompt.strip()
        if not cleaned:
            return "Please provide a question or request for the AI assistant."

        if not self.api_key:
            logging.warning("GEMINI_API_KEY is not set. Falling back to mock response.")
            return _build_prompt_response(cleaned)

        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                response = await client.post(
                    f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={self.api_key}",
                    headers={
                        "Content-Type": "application/json",
                    },
                    json={
                        "contents": [
                            {
                                "parts": [
                                    {"text": cleaned}
                                ]
                            }
                        ]
                    },
                )
                response.raise_for_status()
                payload = response.json()
                candidates = payload.get("candidates", [])
                if not candidates:
                    return _build_prompt_response(cleaned)

                parts = candidates[0].get("content", {}).get("parts", [])
                if not parts:
                    return _build_prompt_response(cleaned)

                candidate = parts[0].get("text")
                if isinstance(candidate, str) and candidate.strip():
                    return candidate.strip()
        except Exception as e:
            logging.exception(f"Gemini API request failed: {e}")
            return f"Error interacting with Gemini API: {str(e)}"

        return _build_prompt_response(cleaned)

