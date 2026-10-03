export type TransactionStatus = 'Completed' | 'Processing' | 'Pending' | 'Failed'

export interface Vendor {
  id: string
  name: string
  shortName: string
  category: string
  amount: number
  deliveryDays: number
  rating: number
  reviewCount: number
  shipping: string
  minOrder: number
  verified: boolean
  description: string
  accent: string
  products: Product[]
}

export interface Product {
  name: string
  price: number
  description: string
  icon: 'bag' | 'book' | 'pen' | 'bottle'
}

export interface Requirements {
  item: string
  quantity: number
  budget: number
  deadlineDays: number
  deliveryLocation: string
  specialRequirements: string
}

export interface Transaction {
  id: string
  goal: string
  vendorId: string
  amount: number
  status: TransactionStatus
  delivery: string
  date: string
}

export interface PaymentResult {
  orderId: string
  captureId: string
  status: 'COMPLETED' | 'PENDING'
}
