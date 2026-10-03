import { createContext } from 'react'
import type { Vendor } from '../types'

export interface PrototypeState {
  selectedVendor: Vendor
  selectVendor: (vendor: Vendor) => void
  goal: string
  setGoal: (goal: string) => void
  toast: string | null
  showToast: (message: string) => void
}

export const PrototypeStore = createContext<PrototypeState | null>(null)
