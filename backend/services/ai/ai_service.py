import logging
from typing import List
from backend.config import settings
from backend.models.schemas import GoalRequirements, VendorOffer, AgentDecision
from backend.services.ai.base import BaseAIProvider
from backend.services.ai.groq_provider import GroqProvider
from backend.services.ai.gemini_provider import GeminiProvider
from backend.services.ai.heuristic_fallback import HeuristicFallbackProvider

logger = logging.getLogger("pact.ai.service")

class AIService:
    def __init__(self):
        self.groq = GroqProvider()
        self.gemini = GeminiProvider()
        self.fallback = HeuristicFallbackProvider()

    def _get_active_provider(self) -> BaseAIProvider:
        provider_name = (settings.AI_PROVIDER or "groq").lower()

        if provider_name == "groq" and settings.is_groq_configured:
            return self.groq
        elif provider_name == "gemini" and settings.is_gemini_configured:
            return self.gemini
        elif settings.is_groq_configured:
            return self.groq
        elif settings.is_gemini_configured:
            return self.gemini

        logger.info("[AI] No live API key configured. Using deterministic Heuristic Engine.")
        return self.fallback

    async def parse_goal(self, goal_text: str) -> GoalRequirements:
        provider = self._get_active_provider()
        logger.info(f"[AI] Parsing goal with provider: {provider.__class__.__name__}")
        try:
            return await provider.parse_goal(goal_text)
        except Exception as e:
            logger.error(f"[AI] Primary provider failed: {e}. Executing fallback.")
            return await self.fallback.parse_goal(goal_text)

    async def evaluate_and_recommend(
        self,
        goal_text: str,
        requirements: GoalRequirements,
        offers: List[VendorOffer]
    ) -> AgentDecision:
        provider = self._get_active_provider()
        logger.info(f"[AI] Evaluating offers with provider: {provider.__class__.__name__}")
        try:
            return await provider.evaluate_and_recommend(goal_text, requirements, offers)
        except Exception as e:
            logger.error(f"[AI] Primary decision evaluation failed: {e}. Executing fallback.")
            return await self.fallback.evaluate_and_recommend(goal_text, requirements, offers)

ai_service = AIService()
