from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class GoalRequirements(BaseModel):
    item: str = Field(description="Commercial item or service name")
    quantity: int = Field(description="Number of units required", ge=1)
    budget: float = Field(description="Maximum budget cap", ge=0)
    currency: str = Field(default="USD", description="Currency ISO code")
    deadline_days: int = Field(description="Maximum turnaround delivery window in days", ge=1)
    delivery_location: str = Field(default="Office HQ, San Francisco", description="Destination location")
    special_requirements: str = Field(default="Standard commercial fulfillment", description="Special terms")

class VendorOffer(BaseModel):
    id: str
    vendor_name: str
    item: str
    quantity: int
    price: float
    currency: str = "USD"
    delivery_days: int
    rating: float = 4.8
    verified: bool = True
    description: str = ""

class OfferEvaluation(BaseModel):
    offer_id: str
    vendor_name: str
    valid: bool
    price: float
    delivery_days: int
    reason: str

class AgentDecision(BaseModel):
    selected_offer_id: str
    vendor_name: str
    total_amount: float
    currency: str = "USD"
    budget_remaining: float
    reasoning: str
    requires_human_approval: bool = True
    evaluations: List[OfferEvaluation] = []

class GoalParseRequest(BaseModel):
    goal_text: str

class GoalPlanRequest(BaseModel):
    goal_text: str
    requirements: Optional[GoalRequirements] = None

class CreateOrderRequest(BaseModel):
    vendor_id: str
    amount: float
    currency: str = "USD"
    item_name: str
    quantity: int = 1
    goal_text: str = ""

class OrderResponse(BaseModel):
    order_id: str
    status: str
    approval_url: Optional[str] = None
    amount: float
    currency: str
    is_sandbox: bool = True

class CaptureOrderRequest(BaseModel):
    order_id: str

class CaptureResponse(BaseModel):
    order_id: str
    capture_id: str
    status: str
    amount: float
    currency: str
    verified: bool
    timestamp: str

class TransactionRecord(BaseModel):
    id: str
    goal_text: str
    parsed_requirements: GoalRequirements
    selected_offer: Dict[str, Any]
    amount: float
    currency: str = "USD"
    paypal_order_id: Optional[str] = None
    paypal_capture_id: Optional[str] = None
    status: str = "PLANNING"
    ai_provider: str = "heuristic"
    ai_reasoning: str = ""
    created_at: str
    updated_at: str
    audit_trail: List[Dict[str, Any]] = []

class ConfigStatusResponse(BaseModel):
    status: str = 'ok'
    paypal_configured: bool
    gemini_configured: bool
    groq_configured: bool
    ai_provider: str
    environment: str
    is_sandbox: bool = True

class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "PACT backend"
    version: str = "1.0.0"

