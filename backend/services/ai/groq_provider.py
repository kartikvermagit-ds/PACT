import json
import logging
from typing import List
from groq import AsyncGroq
from backend.config import settings
from backend.models.schemas import GoalRequirements, VendorOffer, AgentDecision
from backend.services.ai.base import BaseAIProvider
from backend.services.ai.heuristic_fallback import HeuristicFallbackProvider

logger = logging.getLogger("pact.ai.groq")

class GroqProvider(BaseAIProvider):
    def __init__(self):
        self.client = AsyncGroq(api_key=settings.GROQ_API_KEY) if settings.is_groq_configured else None
        self.model = settings.GROQ_MODEL or "llama-3.3-70b-versatile"
        self.fallback = HeuristicFallbackProvider()

    async def parse_goal(self, goal_text: str) -> GoalRequirements:
        if not self.client:
            return await self.fallback.parse_goal(goal_text)

        prompt = (
            f"You are the PACT Intent Extraction Engine. Extract commercial requirements from the following goal:\n"
            f'"{goal_text}"\n\n'
            f"Return ONLY valid JSON matching this exact structure with no extra text:\n"
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

        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a precise JSON-only commercial constraint extractor."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.1
            )
            raw = response.choices[0].message.content
            data = json.loads(raw)
            return GoalRequirements(**data)
        except Exception as e:
            logger.warning(f"[GROQ] Goal parsing failed ({e}). Falling back to heuristic engine.")
            return await self.fallback.parse_goal(goal_text)

    async def evaluate_and_recommend(
        self,
        goal_text: str,
        requirements: GoalRequirements,
        offers: List[VendorOffer]
    ) -> AgentDecision:
        if not self.client:
            return await self.fallback.evaluate_and_recommend(goal_text, requirements, offers)

        offers_data = [o.model_dump() for o in offers]
        prompt = (
            f"User Goal: {goal_text}\n"
            f"Extracted Requirements:\n{requirements.model_dump_json(indent=2)}\n\n"
            f"Available Vendor Offers:\n{json.dumps(offers_data, indent=2)}\n\n"
            f"Evaluate all offers against budget cap (${requirements.budget}) and deadline limit ({requirements.deadline_days} days). "
            f"Mark each as valid: true/false. Recommend the BEST valid offer that maximizes quality and remaining budget.\n"
            f"Return ONLY valid JSON matching this schema:\n"
            f'{{\n'
            f'  "selected_offer_id": "string",\n'
            f'  "vendor_name": "string",\n'
            f'  "total_amount": number,\n'
            f'  "currency": "USD",\n'
            f'  "budget_remaining": number,\n'
            f'  "reasoning": "Detailed justification citing budget and turnaround metrics",\n'
            f'  "requires_human_approval": true,\n'
            f'  "evaluations": [\n'
            f'    {{\n'
            f'      "offer_id": "string",\n'
            f'      "vendor_name": "string",\n'
            f'      "valid": boolean,\n'
            f'      "price": number,\n'
            f'      "delivery_days": number,\n'
            f'      "reason": "string"\n'
            f'    }}\n'
            f'  ]\n'
            f'}}'
        )

        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are PACT, an autonomous commerce decision engine that evaluates vendor offers and outputs strict JSON."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.1
            )
            raw = response.choices[0].message.content
            data = json.loads(raw)
            return AgentDecision(**data)
        except Exception as e:
            logger.warning(f"[GROQ] Decision evaluation failed ({e}). Falling back to heuristic engine.")
            return await self.fallback.evaluate_and_recommend(goal_text, requirements, offers)
