import json
import logging
from typing import List
from backend.config import settings
from backend.models.schemas import GoalRequirements, VendorOffer, AgentDecision
from backend.services.ai.base import BaseAIProvider
from backend.services.ai.heuristic_fallback import HeuristicFallbackProvider

logger = logging.getLogger("pact.ai.gemini")

class GeminiProvider(BaseAIProvider):
    def __init__(self):
        self.fallback = HeuristicFallbackProvider()
        self.model = settings.GEMINI_MODEL or "gemini-1.5-flash"
        self.api_key = settings.GEMINI_API_KEY if settings.is_gemini_configured else None

    async def parse_goal(self, goal_text: str) -> GoalRequirements:
        if not self.api_key:
            return await self.fallback.parse_goal(goal_text)

        try:
            from google import genai
            from google.genai import types
            client = genai.Client(api_key=self.api_key)

            prompt = (
                f"You are the PACT Intent Extraction Engine. Extract commercial requirements from the following goal:\n"
                f'"{goal_text}"\n\n'
                f"Return ONLY valid JSON matching this structure:\n"
                f'{{\n'
                f'  "item": "string",\n'
                f'  "quantity": number,\n'
                f'  "budget": number,\n'
                f'  "currency": "USD",\n'
                f'  "deadline_days": number,\n'
                f'  "delivery_location": "Office HQ, San Francisco",\n'
                f'  "special_requirements": "string"\n'
                f'}}'
            )

            response = client.models.generate_content(
                model=self.model,
                contents=prompt,
                config=types.GenerateContentConfig(response_mime_type="application/json")
            )
            raw = response.text
            data = json.loads(raw)
            return GoalRequirements(**data)
        except Exception as e:
            logger.warning(f"[GEMINI] Goal parsing failed ({e}). Falling back to heuristic engine.")
            return await self.fallback.parse_goal(goal_text)

    async def evaluate_and_recommend(
        self,
        goal_text: str,
        requirements: GoalRequirements,
        offers: List[VendorOffer]
    ) -> AgentDecision:
        if not self.api_key:
            return await self.fallback.evaluate_and_recommend(goal_text, requirements, offers)

        try:
            from google import genai
            from google.genai import types
            client = genai.Client(api_key=self.api_key)

            offers_data = [o.model_dump() for o in offers]
            prompt = (
                f"User Goal: {goal_text}\n"
                f"Requirements: {requirements.model_dump_json()}\n"
                f"Candidate Offers: {json.dumps(offers_data)}\n\n"
                f"Evaluate all offers against budget cap (${requirements.budget}) and deadline limit ({requirements.deadline_days} days). "
                f"Recommend the best valid offer. Return valid JSON matching AgentDecision schema."
            )

            response = client.models.generate_content(
                model=self.model,
                contents=prompt,
                config=types.GenerateContentConfig(response_mime_type="application/json")
            )
            data = json.loads(response.text)
            return AgentDecision(**data)
        except Exception as e:
            logger.warning(f"[GEMINI] Decision evaluation failed ({e}). Falling back to heuristic engine.")
            return await self.fallback.evaluate_and_recommend(goal_text, requirements, offers)
