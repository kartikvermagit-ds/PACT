import time
import logging
from typing import Optional, Dict, Any, Tuple
import httpx
from backend.config import settings

logger = logging.getLogger("pact.paypal")

class PayPalService:
    def __init__(self):
        self.base_url = settings.PAYPAL_BASE_URL.rstrip("/")
        self._cached_token: Optional[str] = None
        self._token_expires_at: float = 0

    async def get_access_token(self) -> str:
        """
        Retrieves OAuth 2.0 access token from PayPal Sandbox using Client Credentials grant.
        Caches the token until 60 seconds before expiration.
        """
        now = time.time()
        if self._cached_token and now < (self._token_expires_at - 60):
            return self._cached_token

        if not settings.is_paypal_configured:
            logger.warning("[PAYPAL] Real credentials not set. Falling back to sandbox simulation mode.")
            return "MOCK_PAYPAL_SANDBOX_TOKEN"

        url = f"{self.base_url}/v1/oauth2/token"
        headers = {
            "Accept": "application/json",
            "Accept-Language": "en_US",
        }
        data = {"grant_type": "client_credentials"}

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(
                    url,
                    headers=headers,
                    data=data,
                    auth=(settings.PAYPAL_CLIENT_ID, settings.PAYPAL_CLIENT_SECRET)
                )

                if response.status_code != 200:
                    logger.error(f"[PAYPAL] OAuth error: HTTP {response.status_code} - {response.text}")
                    raise RuntimeError(f"PayPal OAuth Authentication failed: {response.text}")

                res_json = response.json()
                self._cached_token = res_json["access_token"]
                expires_in = res_json.get("expires_in", 3600)
                self._token_expires_at = now + expires_in
                logger.info("[PAYPAL] OAuth 2.0 access token refreshed successfully.")
                return self._cached_token
        except httpx.RequestError as exc:
            logger.error(f"[PAYPAL] Network error during OAuth: {exc}")
            raise RuntimeError(f"Failed to communicate with PayPal Sandbox: {exc}")

    async def create_order(
        self,
        amount: float,
        currency: str = "USD",
        reference_id: str = "PACT-REF",
        description: str = "PACT Agentic Transaction",
        return_url: Optional[str] = None,
        cancel_url: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Creates an order with INTENT=CAPTURE in PayPal Sandbox Orders v2 API.
        """
        token = await self.get_access_token()

        if token == "MOCK_PAYPAL_SANDBOX_TOKEN":
            # Simulation fallback when user has not yet pasted real sandbox keys
            simulated_order_id = f"SANDBOX-SIM-{int(time.time())}"
            logger.info(f"[PAYPAL] Simulated order created: {simulated_order_id}")
            return {
                "id": simulated_order_id,
                "status": "CREATED",
                "approval_url": f"https://www.sandbox.paypal.com/checkoutnow?token={simulated_order_id}",
                "amount": amount,
                "currency": currency,
                "is_sandbox": True
            }

        url = f"{self.base_url}/v2/checkout/orders"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}",
            "Prefer": "return=representation"
        }

        ret_url = return_url or f"{settings.FRONTEND_URL}/payment?approved=true"
        can_url = cancel_url or f"{settings.FRONTEND_URL}/review?canceled=true"

        payload = {
            "intent": "CAPTURE",
            "purchase_units": [
                {
                    "reference_id": reference_id,
                    "description": description[:127],
                    "amount": {
                        "currency_code": currency,
                        "value": f"{amount:.2f}"
                    }
                }
            ],
            "application_context": {
                "brand_name": "PACT Commerce Agent",
                "landing_page": "NO_PREFERENCE",
                "user_action": "PAY_NOW",
                "return_url": ret_url,
                "cancel_url": can_url
            }
        }

        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(url, headers=headers, json=payload)
            if response.status_code not in (200, 201):
                logger.error(f"[PAYPAL] Create order failed: HTTP {response.status_code} - {response.text}")
                raise RuntimeError(f"PayPal Create Order error: {response.text}")

            data = response.json()
            order_id = data.get("id")
            status = data.get("status", "CREATED")

            approval_url = None
            for link in data.get("links", []):
                if link.get("rel") == "approve":
                    approval_url = link.get("href")
                    break

            logger.info(f"[PAYPAL] Order created successfully: {order_id} ({status})")
            return {
                "id": order_id,
                "status": status,
                "approval_url": approval_url,
                "amount": amount,
                "currency": currency,
                "is_sandbox": True
            }

    async def capture_order(self, order_id: str) -> Dict[str, Any]:
        """
        Captures authorized payment for an approved order.
        """
        token = await self.get_access_token()

        if token == "MOCK_PAYPAL_SANDBOX_TOKEN" or order_id.startswith("SANDBOX-SIM-"):
            # Simulated capture fallback
            capture_id = f"CAP-SIM-{int(time.time())}"
            logger.info(f"[PAYPAL] Order {order_id} captured in simulation: {capture_id}")
            return {
                "order_id": order_id,
                "capture_id": capture_id,
                "status": "COMPLETED",
                "amount": 465.0,
                "currency": "USD",
                "verified": True,
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            }

        url = f"{self.base_url}/v2/checkout/orders/{order_id}/capture"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}",
            "Prefer": "return=representation"
        }

        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(url, headers=headers, json={})
            if response.status_code not in (200, 201):
                logger.error(f"[PAYPAL] Capture order failed: HTTP {response.status_code} - {response.text}")
                raise RuntimeError(f"PayPal Capture Order error: {response.text}")

            data = response.json()
            status = data.get("status", "COMPLETED")

            capture_id = "N/A"
            captured_amount = 0.0
            currency = "USD"

            try:
                purchase_units = data.get("purchase_units", [])
                if purchase_units:
                    payments = purchase_units[0].get("payments", {})
                    captures = payments.get("captures", [])
                    if captures:
                        cap = captures[0]
                        capture_id = cap.get("id", capture_id)
                        captured_amount = float(cap.get("amount", {}).get("value", 0))
                        currency = cap.get("amount", {}).get("currency_code", currency)
            except Exception as e:
                logger.warning(f"[PAYPAL] Could not parse capture details from response: {e}")

            logger.info(f"[PAYPAL] Order {order_id} captured successfully: Capture ID {capture_id}")
            return {
                "order_id": order_id,
                "capture_id": capture_id,
                "status": status,
                "amount": captured_amount,
                "currency": currency,
                "verified": (status == "COMPLETED"),
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            }

    async def get_order(self, order_id: str) -> Dict[str, Any]:
        """
        Retrieves order details from PayPal Sandbox Orders API.
        """
        token = await self.get_access_token()
        if token == "MOCK_PAYPAL_SANDBOX_TOKEN" or order_id.startswith("SANDBOX-SIM-"):
            return {
                "id": order_id,
                "status": "COMPLETED",
                "amount": {"currency_code": "USD", "value": "465.00"}
            }

        url = f"{self.base_url}/v2/checkout/orders/{order_id}"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(url, headers=headers)
            if response.status_code != 200:
                raise RuntimeError(f"Failed to fetch PayPal order: {response.text}")
            return response.json()

paypal_service = PayPalService()
