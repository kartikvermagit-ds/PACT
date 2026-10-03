import { Check, Truck } from 'lucide-react'
import { Rating, StatusBadge, VendorMark } from './ui'
import type { Vendor } from '../types'

export function VendorCard({ vendor, selected, onSelect, compact = false }: { vendor: Vendor; selected?: boolean; onSelect?: () => void; compact?: boolean }) {
  return <article className={`vendor-card ${selected ? 'selected' : ''}`}>
    {selected && <div className="best-match">BEST MATCH</div>}
    <div className="vendor-card-head"><VendorMark vendor={vendor} /><div><h3>{vendor.name}</h3><span>{vendor.category}</span></div>{vendor.verified && <StatusBadge status="Verified" />}</div>
    <div className="vendor-card-price"><strong>${vendor.amount}</strong><span>total for 30 kits</span></div>
    <div className="vendor-stats"><Rating value={vendor.rating} /><span><Truck size={14} />{vendor.deliveryDays} days</span><span>{vendor.shipping}</span></div>
    {!compact && <div className="vendor-card-list"><span><Check size={14} />{vendor.deliveryDays <= 5 ? 'Meets 5-day deadline' : 'Delivery outside target'}</span><span><Check size={14} />{vendor.amount <= 500 ? 'Within $500 budget' : 'Over budget'}</span></div>}
    {onSelect && <button className="vendor-select" onClick={onSelect}>{selected ? 'Selected' : 'Select vendor'}</button>}
  </article>
}
