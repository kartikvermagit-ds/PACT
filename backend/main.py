import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings
from backend.routers import system, goals, orders, transactions, webhook

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("pact.app")

app = FastAPI(
    title="PACT API — PayPal Agentic Commerce Transactions",
    description="Turn natural language commercial intent into a verified PayPal Sandbox transaction.",
    version="1.0.0"
)

# CORS configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    settings.FRONTEND_URL.rstrip("/")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers under /api
app.include_router(system.router, prefix="/api")
app.include_router(goals.router, prefix="/api")
app.include_router(orders.router, prefix="/api")
app.include_router(transactions.router, prefix="/api")
app.include_router(webhook.router, prefix="/api")

@app.on_event("startup")
async def startup_event():
    logger.info("==================================================")
    logger.info("PACT — PayPal Agentic Commerce Transactions Backend")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"PayPal Sandbox: {'CONFIGURED' if settings.is_paypal_configured else 'SIMULATION MODE (Set keys in .env)'}")
    logger.info(f"AI Provider: {settings.AI_PROVIDER}")
    logger.info(f"Groq Configured: {settings.is_groq_configured}")
    logger.info(f"Gemini Configured: {settings.is_gemini_configured}")
    logger.info("==================================================")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
