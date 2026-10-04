from typing import List
from fastapi import APIRouter, HTTPException
from backend.models.schemas import TransactionRecord
from backend.services.transaction_service import transaction_service

router = APIRouter(prefix="/transactions", tags=["Transactions & Audit"])

@router.get("", response_model=List[TransactionRecord])
async def list_all_transactions():
    """
    Returns verified transaction history ledger.
    """
    return transaction_service.list_transactions()

@router.get("/{transaction_id}", response_model=TransactionRecord)
async def get_transaction_details(transaction_id: str):
    """
    Returns full transaction audit trail.
    """
    tx = transaction_service.get_transaction(transaction_id)
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found in ledger.")
    return tx
