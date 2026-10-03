import { useContext } from 'react'
import { PrototypeStore } from './prototypeStore'

export function usePrototype() {
  const state = useContext(PrototypeStore)
  if (!state) throw new Error('usePrototype must be used within PrototypeProvider')
  return state
}
