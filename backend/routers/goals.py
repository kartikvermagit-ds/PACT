import json
from pathlib import Path
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException
from backend.models.schemas import GoalParseRequest, GoalPlanRequest, GoalRequirements, AgentDecision, VendorOffer
from backend.services.ai.ai_service import ai_service
from backend.services.transaction_service import transaction_service

router = APIRouter(prefix="/goals", tags=["Goals & AI"])

def _load_offers() -> List[VendorOffer]:
    data_path = Path(__file__).resolve().parent.parent / "data" / "offers.json"
    if not data_path.exists():
        return []
    with open(data_path, "r", encoding="utf-8-sig") as f:
        items = json.load(f)
    return [VendorOffer(**item) for item in items]

@router.post("/parse", response_model=GoalRequirements)
async def parse_goal_intent(payload: GoalParseRequest):
    """
    Interprets natural language commercial objective and extracts structured constraints.
    """
    if not payload.goal_text.strip():
        raise HTTPException(status_code=400, detail="Goal text cannot be empty.")

    requirements = await ai_service.parse_goal(payload.goal_text)
    return requirements

@router.post("/plan")
async def plan_goal_execution(payload: GoalPlanRequest):
    """
    Evaluates candidate offers against requirements, recommends best option, and prepares transaction.
    """
    requirements = payload.requirements
    if not requirements:
        requirements = await ai_service.parse_goal(payload.goal_text)

    all_offers = _load_offers()
    decision = await ai_service.evaluate_and_recommend(payload.goal_text, requirements, all_offers)

    # Find the selected offer details
    selected_offer_dict = {}
    for o in all_offers:
        if o.id == decision.selected_offer_id:
            selected_offer_dict = o.model_dump()
            break

    # Initialize a draft transaction
    tx = transaction_service.create_transaction(
        goal_text=payload.goal_text,
        requirements=requirements,
        selected_offer=selected_offer_dict,
        amount=decision.total_amount,
        ai_provider=ai_service._get_active_provider().__class__.__name__,
        ai_reasoning=decision.reasoning
    )

    return {
        "decision": decision,
        "requirements": requirements,
        "available_offers": [o.model_dump() for o in all_offers],
        "transaction_id": tx.id
    }
