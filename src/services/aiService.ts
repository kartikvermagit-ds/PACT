import { requirements, vendors } from '../data/mockData'
import type { Requirements, Vendor } from '../types'

export const aiService = {
  parseGoal: async (_goal: string): Promise<Requirements> => requirements,
  extractRequirements: async (): Promise<Requirements> => requirements,
  findVendors: async (): Promise<Vendor[]> => vendors,
  compareVendors: async (): Promise<Vendor[]> => vendors.slice(0, 3),
  generateRecommendation: async (): Promise<{ vendorId: string; reasoning: string }> => ({
    vendorId: 'officekart',
    reasoning: 'OfficeKart meets the budget and delivery deadline while offering the strongest combination of rating, price, and free shipping.',
  }),
}
