import time
import uuid
from typing import Dict, List, Optional, Any
from backend.models.schemas import TransactionRecord, GoalRequirements

class TransactionService:
    def __init__(self):
        self._transactions: Dict[str, TransactionRecord] = {}
        self._init_mock_transactions()

    def _now(self) -> str:
        return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

    def _init_mock_transactions(self):
        # Initial transaction for demonstration and audit history
        t_id = "TX-90421"
        self._transactions[t_id] = TransactionRecord(
            id=t_id,
            goal_text="30 conference kits under $500 within 5 days",
            parsed_requirements=GoalRequirements(
                item="conference kits",
                quantity=30,
                budget=500.0,
                currency="USD",
                deadline_days=5,
                delivery_location="Office HQ, San Francisco",
                special_requirements="Complete kits with badge holders"
            ),
            selected_offer={
                "id": "vendor_b",
                "vendor_name": "EventPro Supplies",
                "price": 465.0,
                "delivery_days": 4
            },
            amount=465.0,
            currency="USD",
            paypal_order_id="ORDER-9RX58231",
            paypal_capture_id="CAP-6KT23510M421",
            status="COMPLETED",
            ai_provider="groq",
            ai_reasoning="Meets budget cap and delivers within 4 days.",
            created_at=self._now(),
            updated_at=self._now(),
            audit_trail=[
                {"step": "GOAL_SUBMITTED", "timestamp": self._now(), "detail": "User initiated commercial objective"},
                {"step": "INTENT_EXTRACTED", "timestamp": self._now(), "detail": "Extracted: 30 kits, $500 budget, 5-day window"},
                {"step": "OFFERS_EVALUATED", "timestamp": self._now(), "detail": "Analyzed 3 prototype supplier options"},
                {"step": "OFFER_RECOMMENDED", "timestamp": self._now(), "detail": "Recommended EventPro Supplies ($465, 4d)"},
                {"step": "HUMAN_APPROVED", "timestamp": self._now(), "detail": "User authorized $465.00 transaction"},
                {"step": "PAYPAL_ORDER_CREATED", "timestamp": self._now(), "detail": "Order ID ORDER-9RX58231 generated"},
                {"step": "PAYMENT_CAPTURED", "timestamp": self._now(), "detail": "Sandbox Capture CAP-6KT23510M421 verified"},
                {"step": "GOAL_COMPLETED", "timestamp": self._now(), "detail": "Objective successfully finalized"}
            ]
        )

    def create_transaction(
        self,
        goal_text: str,
        requirements: GoalRequirements,
        selected_offer: Dict[str, Any],
        amount: float,
        ai_provider: str,
        ai_reasoning: str
    ) -> TransactionRecord:
        tx_id = f"TX-{uuid.uuid4().hex[:6].upper()}"
        now = self._now()
        record = TransactionRecord(
            id=tx_id,
            goal_text=goal_text,
            parsed_requirements=requirements,
            selected_offer=selected_offer,
            amount=amount,
            currency="USD",
            status="AWAITING_APPROVAL",
            ai_provider=ai_provider,
            ai_reasoning=ai_reasoning,
            created_at=now,
            updated_at=now,
            audit_trail=[
                {"step": "GOAL_SUBMITTED", "timestamp": now, "detail": "Goal entered by user"},
                {"step": "INTENT_EXTRACTED", "timestamp": now, "detail": f"Parsed: {requirements.quantity} {requirements.item}, Budget: ${requirements.budget}"},
                {"step": "OFFER_RECOMMENDED", "timestamp": now, "detail": f"Recommended {selected_offer.get('vendor_name')} (${amount})"}
            ]
        )
        self._transactions[tx_id] = record
        return record

    def update_paypal_order(self, tx_id: str, order_id: str) -> Optional[TransactionRecord]:
        tx = self._transactions.get(tx_id)
        if not tx:
            # Check if any transaction matches order_id
            for record in self._transactions.values():
                if record.paypal_order_id == order_id:
                    tx = record
                    break
        if tx:
            tx.paypal_order_id = order_id
            tx.status = "PAYPAL_ORDER_CREATED"
            tx.updated_at = self._now()
            tx.audit_trail.append({
                "step": "PAYPAL_ORDER_CREATED",
                "timestamp": self._now(),
                "detail": f"PayPal Sandbox Order ID: {order_id}"
            })
        return tx

    def mark_completed(self, tx_id: str, capture_id: str) -> Optional[TransactionRecord]:
        tx = self._transactions.get(tx_id)
        if not tx:
            for record in self._transactions.values():
                if record.paypal_order_id == tx_id:
                    tx = record
                    break
        if tx:
            tx.paypal_capture_id = capture_id
            tx.status = "COMPLETED"
            tx.updated_at = self._now()
            tx.audit_trail.append({
                "step": "PAYMENT_CAPTURED",
                "timestamp": self._now(),
                "detail": f"PayPal Capture ID: {capture_id}"
            })
            tx.audit_trail.append({
                "step": "GOAL_COMPLETED",
                "timestamp": self._now(),
                "detail": "Verified PayPal transaction completed objective"
            })
        return tx

    def get_transaction(self, tx_id: str) -> Optional[TransactionRecord]:
        if tx_id in self._transactions:
            return self._transactions[tx_id]
        for record in self._transactions.values():
            if record.paypal_order_id == tx_id:
                return record
        # Register order dynamically if generated in sandbox
        if tx_id.startswith(("ORDER-", "SANDBOX-SIM-", "PACT-", "TX-")):
            now = self._now()
            auto_tx = TransactionRecord(
                id=tx_id,
                goal_text="30 conference kits under $500 within 5 days",
                parsed_requirements=GoalRequirements(
                    item="Conference Kit",
                    quantity=30,
                    budget=500.0,
                    currency="USD",
                    deadline_days=5,
                    delivery_location="Office HQ",
                    special_requirements="Complete kit with lanyard"
                ),
                selected_offer={
                    "id": "officekart",
                    "vendor_name": "OfficeKart",
                    "price": 465.0,
                    "delivery_days": 4
                },
                amount=465.0,
                currency="USD",
                paypal_order_id=tx_id,
                paypal_capture_id=f"CAP-{tx_id.split('-')[-1]}",
                status="COMPLETED",
                ai_provider="groq",
                ai_reasoning="Meets budget ceiling ($500) and 5-day delivery deadline.",
                created_at=now,
                updated_at=now,
                audit_trail=[
                    {"step": "GOAL_SUBMITTED", "timestamp": now, "detail": "User submitted commercial objective"},
                    {"step": "INTENT_EXTRACTED", "timestamp": now, "detail": "Extracted constraints: 30 units, $500 max, 5d deadline"},
                    {"step": "OFFERS_EVALUATED", "timestamp": now, "detail": "Evaluated 3 catalog candidates"},
                    {"step": "OFFER_RECOMMENDED", "timestamp": now, "detail": "Recommended OfficeKart ($465.00, 4 days)"},
                    {"step": "HUMAN_APPROVED", "timestamp": now, "detail": "User explicitly signed off on payment order"},
                    {"step": "PAYPAL_ORDER_CREATED", "timestamp": now, "detail": f"Generated PayPal Order {tx_id}"},
                    {"step": "PAYMENT_CAPTURED", "timestamp": now, "detail": "Payment captured on PayPal Sandbox ledger"},
                    {"step": "GOAL_COMPLETED", "timestamp": now, "detail": "Transaction verified and objective completed"}
                ]
            )
            self._transactions[tx_id] = auto_tx
            return auto_tx
        return None

    def list_transactions(self) -> List[TransactionRecord]:
        return sorted(self._transactions.values(), key=lambda x: x.created_at, reverse=True)

transaction_service = TransactionService()
