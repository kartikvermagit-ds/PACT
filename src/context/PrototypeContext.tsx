import { useMemo, useState, type ReactNode } from 'react'
import { vendors } from '../data/mockData'
import { PrototypeStore } from './prototypeStore'

export function PrototypeProvider({ children }: { children: ReactNode }) {
  const [selectedVendor, selectVendor] = useState(vendors[1])
  const [goal, setGoal] = useState('I need 30 conference kits under $500 within 5 days.')
  const [toast, setToast] = useState<string | null>(null)
  const showToast = (message: string) => { setToast(message); window.setTimeout(() => setToast(null), 3000) }
  const value = useMemo(() => ({ selectedVendor, selectVendor, goal, setGoal, toast, showToast }), [selectedVendor, goal, toast])
  return <PrototypeStore.Provider value={value}>{children}</PrototypeStore.Provider>
}
