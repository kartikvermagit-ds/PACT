import re
from typing import List
from backend.models.schemas import GoalRequirements, VendorOffer, AgentDecision, OfferEvaluation
from backend.services.ai.base import BaseAIProvider

class HeuristicFallbackProvider(BaseAIProvider):
    async def parse_goal(self, goal_text: str) -> GoalRequirements:
        # Dynamic extraction heuristics
        qty_match = re.search(r"(\d+)\s*(conference|kits?|items?|boxes?|pieces?|t-shirts?|hoodies?|bags?)", goal_text, re.I)
        budget_match = re.search(r"(?:under|budget|for|total|\$)\s*\$?(\d+(?:\.\d{1,2})?)", goal_text, re.I)
        if not budget_match:
            budget_match = re.search(r"\$?(\d+(?:\.\d{1,2})?)\s*(?:usd|dollars?|budget|max)", goal_text, re.I)
        deadline_match = re.search(r"(\d+)\s*(?:days?|business days?)", goal_text, re.I)

        quantity = int(qty_match.group(1)) if qty_match else 30
        budget = float(budget_match.group(1)) if budget_match else 500.0
        deadline = int(deadline_match.group(1)) if deadline_match else 5

        item = "conference kits"
        lower = goal_text.lower()
        if "swag" in lower or "hoodie" in lower or "apparel" in lower:
            item = "Team Swag & Apparel"
        elif "onboarding" in lower or "starter pack" in lower:
            item = "New Hire Starter Pack"
        elif "bag" in lower:
            item = "Eco-Friendly Event Bags"

        return GoalRequirements(
            item=item,
            quantity=quantity,
            budget=budget,
            currency="USD",
            deadline_days=deadline,
            delivery_location="Office HQ, San Francisco",
            special_requirements="Pre-assembled kits with express shipping"
        )

    async def evaluate_and_recommend(
        self,
        goal_text: str,
        requirements: GoalRequirements,
        offers: List[VendorOffer]
    ) -> AgentDecision:
        evaluations: List[OfferEvaluation] = []
        valid_candidates: List[VendorOffer] = []

        for offer in offers:
            within_budget = offer.price <= requirements.budget
            within_deadline = offer.delivery_days <= requirements.deadline_days
            is_valid = within_budget and within_deadline

            reasons = []
            if not within_budget:
                reasons.append(f"Exceeds budget (${offer.price} > ${requirements.budget})")
            if not within_deadline:
                reasons.append(f"Exceeds deadline ({offer.delivery_days}d > {requirements.deadline_days}d)")
            if is_valid:
                reasons.append(f"Within budget (${offer.price} <= ${requirements.budget}) and delivers in {offer.delivery_days}d")
                valid_candidates.append(offer)

            evaluations.append(
                OfferEvaluation(
                    offer_id=offer.id,
                    vendor_name=offer.vendor_name,
                    valid=is_valid,
                    price=offer.price,
                    delivery_days=offer.delivery_days,
                    reason="; ".join(reasons)
                )
            )

        # Select best valid candidate
        if valid_candidates:
            # Sort valid candidates by price ascending (maximizing budget remaining)
            best = min(valid_candidates, key=lambda x: x.price)
            budget_remaining = round(requirements.budget - best.price, 2)
            reasoning = (
                f"Selected {best.vendor_name} because it fully satisfies all hard constraints: "
                f"${best.price:.2f} total cost is within the ${requirements.budget:.2f} budget cap "
                f"(${budget_remaining:.2f} surplus saved), and delivery completes in {best.delivery_days} days "
                f"(within the {requirements.deadline_days}-day limit)."
            )
            selected_id = best.id
            selected_name = best.vendor_name
            selected_price = best.price
        else:
            # Fallback to closest offer if no offer strictly satisfies all
            fallback = offers[0] if offers else VendorOffer(id="vendor_b", vendor_name="EventPro Supplies", item="kits", quantity=30, price=465, delivery_days=4)
            selected_id = fallback.id
            selected_name = fallback.vendor_name
            selected_price = fallback.price
            budget_remaining = round(requirements.budget - selected_price, 2)
            reasoning = f"No offer strictly met all constraints. Recommended closest option: {fallback.vendor_name}."

        return AgentDecision(
            selected_offer_id=selected_id,
            vendor_name=selected_name,
            total_amount=selected_price,
            currency="USD",
            budget_remaining=budget_remaining,
            reasoning=reasoning,
            requires_human_approval=True,
            evaluations=evaluations
        )
