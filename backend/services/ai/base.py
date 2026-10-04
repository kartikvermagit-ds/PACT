from abc import ABC, abstractmethod
from typing import List
from backend.models.schemas import GoalRequirements, VendorOffer, AgentDecision

class BaseAIProvider(ABC):
    @abstractmethod
    async def parse_goal(self, goal_text: str) -> GoalRequirements:
        """Parses natural language commercial goal into structured requirements."""
        pass

    @abstractmethod
    async def evaluate_and_recommend(
        self,
        goal_text: str,
        requirements: GoalRequirements,
        offers: List[VendorOffer]
    ) -> AgentDecision:
        """Evaluates offers against extracted requirements and recommends the optimal valid choice."""
        pass
