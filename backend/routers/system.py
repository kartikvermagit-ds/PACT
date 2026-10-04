from fastapi import APIRouter
from backend.config import settings
from backend.models.schemas import HealthResponse, ConfigStatusResponse

router = APIRouter(tags=["System"])

@router.get("/health", response_model=HealthResponse)
async def get_health():
    return HealthResponse(
        status="ok",
        service="PACT backend",
        version="1.0.0"
    )

@router.get("/config/status", response_model=ConfigStatusResponse)
async def get_config_status():
    """
    Returns public non-sensitive configuration status. Never returns API keys or secrets.
    """
    return ConfigStatusResponse(
        paypal_configured=settings.is_paypal_configured,
        gemini_configured=settings.is_gemini_configured,
        groq_configured=settings.is_groq_configured,
        ai_provider=settings.AI_PROVIDER,
        environment=settings.ENVIRONMENT,
        is_sandbox=True
    )
