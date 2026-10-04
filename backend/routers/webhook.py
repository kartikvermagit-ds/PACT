import logging
from typing import Dict, Any
from fastapi import APIRouter, Request, HTTPException
from backend.services.transaction_service import transaction_service

logger = logging.getLogger("pact.webhook")
router = APIRouter(prefix="/paypal", tags=["PayPal Webhook"])

@router.post("/webhook")
async def handle_paypal_webhook(request: Request):
    """
    Receives and processes PayPal webhook notifications.
    """
    try:
        body = await request.json()
        event_type = body.get("event_type", "UNKNOWN")
        resource = body.get("resource", {})

        logger.info(f"[PAYPAL] Webhook event received: {event_type}")

        if event_type == "PAYMENT.CAPTURE.COMPLETED":
            capture_id = resource.get("id")
            order_id = resource.get("supplementary_data", {}).get("related_ids", {}).get("order_id")
            if order_id and capture_id:
                transaction_service.mark_completed(order_id, capture_id)
                logger.info(f"[PAYPAL] Webhook verified capture {capture_id} for order {order_id}")

        return {"status": "received", "event_type": event_type}
    except Exception as e:
        logger.error(f"[PAYPAL] Webhook processing failed: {e}")
        return {"status": "error", "detail": str(e)}
