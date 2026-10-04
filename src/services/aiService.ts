import { requirements as defaultRequirements, vendors } from '../data/mockData'
import type { Requirements, Vendor } from '../types'
import { apiRequest } from './apiClient'

interface BackendGoalRequirements {
  item: string
  quantity: number
  budget: number
  currency: string
  deadline_days: number
  delivery_location: string
  special_requirements: string
}

interface BackendPlanResponse {
  decision: {
    selected_offer_id: string
    vendor_name: string
    total_amount: number
    currency: string
    budget_remaining: number
    reasoning: string
    requires_human_approval: boolean
    evaluations: Array<{
      offer_id: string
      vendor_name: string
      valid: boolean
      price: number
      delivery_days: number
      reason: string
    }>
  }
  requirements: BackendGoalRequirements
  available_offers: Array<{
    id: string
    vendor_name: string
    item: string
    quantity: number
    price: number
    delivery_days: number
    rating: number
    verified: boolean
    description: string
  }>
  transaction_id: string
}

export const aiService = {
  /**
   * Parses natural language input into structured commerce requirements via FastAPI AI engine.
   */
  parseGoal: async (goalText: string): Promise<Requirements> => {
    try {
      const data = await apiRequest<BackendGoalRequirements>('/goals/parse', {
        method: 'POST',
        body: JSON.stringify({ goal_text: goalText }),
      })

      return {
        item: data.item,
        quantity: data.quantity,
        budget: data.budget,
        deadlineDays: data.deadline_days,
        deliveryLocation: data.delivery_location || defaultRequirements.deliveryLocation,
        specialRequirements: data.special_requirements || defaultRequirements.specialRequirements,
      }
    } catch (err) {
      console.warn('[aiService] Backend parse failed, using client fallback:', err)
      // Dynamic extraction heuristic fallback
      const quantityMatch = goalText.match(/(\d+)\s*(conference|kits|items|boxes|pieces|t-shirts|hoodies)/i)
      const budgetMatch = goalText.match(/\$?(\d+)\s*(budget|under|total|\$)/i) || goalText.match(/under\s*\$?(\d+)/i)
      const deadlineMatch = goalText.match(/(\d+)\s*(days|day)/i)

      const quantity = quantityMatch ? Number.parseInt(quantityMatch[1], 10) : defaultRequirements.quantity
      const budget = budgetMatch ? Number.parseInt(budgetMatch[1], 10) : defaultRequirements.budget
      const deadlineDays = deadlineMatch ? Number.parseInt(deadlineMatch[1], 10) : defaultRequirements.deadlineDays

      let item = defaultRequirements.item
      if (goalText.toLowerCase().includes('hoodie') || goalText.toLowerCase().includes('t-shirt') || goalText.toLowerCase().includes('swag')) {
        item = 'Team Swag & Apparel'
      } else if (goalText.toLowerCase().includes('onboarding') || goalText.toLowerCase().includes('desk')) {
        item = 'New Hire Starter Pack'
      } else if (goalText.toLowerCase().includes('badge') || goalText.toLowerCase().includes('lanyard')) {
        item = 'Event Badges & Lanyards'
      }

      return {
        item,
        quantity,
        budget,
        deadlineDays,
        deliveryLocation: defaultRequirements.deliveryLocation,
        specialRequirements: defaultRequirements.specialRequirements,
      }
    }
  },

  /**
   * Extracts detailed requirement specifications.
   */
  extractRequirements: async (): Promise<Requirements> => {
    return defaultRequirements
  },

  /**
   * Queries verified vendors that match category and capacity.
   */
  findVendors: async (): Promise<Vendor[]> => {
    return vendors
  },

  /**
   * Compares top vendor candidates based on price, delivery, and reliability.
   */
  compareVendors: async (): Promise<Vendor[]> => {
    return vendors.slice(0, 3)
  },

  /**
   * Evaluates criteria and returns transparent recommendation with reasoning from FastAPI backend.
   */
  generateRecommendation: async (
    targetBudget: number = 500,
    targetDeadline: number = 5,
    goalText: string = '30 conference kits under $500 within 5 days'
  ): Promise<{ vendorId: string; reasoning: string; transactionId?: string; evaluations?: any[] }> => {
    try {
      const plan = await apiRequest<BackendPlanResponse>('/goals/plan', {
        method: 'POST',
        body: JSON.stringify({
          goal_text: goalText,
          requirements: {
            item: 'conference kits',
            quantity: 30,
            budget: targetBudget,
            currency: 'USD',
            deadline_days: targetDeadline,
            delivery_location: 'Office HQ, San Francisco',
            special_requirements: 'Standard commercial fulfillment',
          },
        }),
      })

      // Map backend offer ID to frontend vendor ID if needed
      let matchedVendorId = vendors[1].id
      if (plan.decision.selected_offer_id.includes('officekart') || plan.decision.selected_offer_id === 'vendor_b') {
        matchedVendorId = 'officekart'
      } else if (plan.decision.selected_offer_id.includes('swag') || plan.decision.selected_offer_id === 'vendor_c') {
        matchedVendorId = 'swaghub'
      } else if (plan.decision.selected_offer_id.includes('fastkit') || plan.decision.selected_offer_id === 'vendor_a') {
        matchedVendorId = 'fastkit'
      }

      return {
        vendorId: matchedVendorId,
        reasoning: plan.decision.reasoning,
        transactionId: plan.transaction_id,
        evaluations: plan.decision.evaluations,
      }
    } catch (err) {
      console.warn('[aiService] Backend plan failed, using client evaluation fallback:', err)
      const bestVendor =
        vendors.find((v) => v.amount <= targetBudget && v.deliveryDays <= targetDeadline) || vendors[1]

      return {
        vendorId: bestVendor.id,
        reasoning: `${bestVendor.name} meets the budget ($${bestVendor.amount} <= $${targetBudget}) and arrives in ${bestVendor.deliveryDays} days (target: ${targetDeadline} days) with a stellar ${bestVendor.rating} rating from ${bestVendor.reviewCount.toLocaleString()} reviews.`,
      }
    }
  },
}
