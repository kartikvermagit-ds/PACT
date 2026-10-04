import logging
from fastapi import APIRouter, HTTPException
from backend.models.schemas import CreateOrderRequest, OrderResponse, CaptureResponse
from backend.services.paypal_service import paypal_service
from backend.services.transaction_service import transaction_service

logger = logging.getLogger("pact.orders")
router = APIRouter(prefix="/orders", tags=["Orders & PayPal"])

@router.post("/create", response_model=OrderResponse)
async def create_paypal_order(payload: CreateOrderRequest):
    """
    Creates a PayPal Sandbox order after human approval.
    """
    try:
        order_data = await paypal_service.create_order(
            amount=payload.amount,
            currency=payload.currency,
            reference_id=payload.vendor_id,
            description=f"PACT: {payload.quantity}x {payload.item_name}"
        )

        order_id = order_data["id"]
        # Update ledger
        transaction_service.update_paypal_order(order_id, order_id)

        return OrderResponse(
            order_id=order_id,
            status=order_data["status"],
            approval_url=order_data.get("approval_url"),
            amount=payload.amount,
            currency=payload.currency,
            is_sandbox=True
        )
    except Exception as e:
        logger.error(f"[ORDERS] Order creation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{order_id}/capture", response_model=CaptureResponse)
async def capture_paypal_order(order_id: str):
    """
    Captures authorized payment from PayPal Sandbox and verifies completion.
    """
    try:
        capture_data = await paypal_service.capture_order(order_id)
        # Update transaction ledger
        transaction_service.mark_completed(order_id, capture_data["capture_id"])

        return CaptureResponse(**capture_data)
    except Exception as e:
        logger.error(f"[ORDERS] Capture failed for order {order_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{order_id}")
async def get_order_details(order_id: str):
    """
    Queries PayPal Sandbox for verified order details.
    """
    try:
        return await paypal_service.get_order(order_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Order not found: {e}")
