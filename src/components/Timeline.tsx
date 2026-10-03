import { Check } from 'lucide-react'

export function Timeline({ events, activeLast = false }: { events: string[][]; activeLast?: boolean }) {
  return <ol className="timeline">{events.map(([title, time], index) => <li key={title} className={activeLast && index === events.length - 1 ? 'timeline-active' : ''}><span><Check size={12} /></span><div><strong>{title}</strong><small>{time}</small></div></li>)}</ol>
}
