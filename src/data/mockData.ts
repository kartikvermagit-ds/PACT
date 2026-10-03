import type { Requirements, Transaction, Vendor } from '../types'

export const coreGoal = 'I need 30 conference kits under $500 within 5 days.'

export const requirements: Requirements = {
  item: 'Conference Kit', quantity: 30, budget: 500, deadlineDays: 5,
  deliveryLocation: 'Not specified', specialRequirements: 'Standard conference kit with essentials',
}

export const vendors: Vendor[] = [
  { id: 'eventessentials', name: 'EventEssentials', shortName: 'Vendor A', category: 'Event supplies', amount: 520, deliveryDays: 6, rating: 4.6, reviewCount: 324, shipping: '$18 shipping', minOrder: 20, verified: true, description: 'A broad catalog for corporate events and conference essentials.', accent: '#5b6ddf', products: [] },
  { id: 'officekart', name: 'OfficeKart', shortName: 'Vendor B', category: 'Corporate kits', amount: 465, deliveryDays: 4, rating: 4.8, reviewCount: 1284, shipping: 'Free shipping', minOrder: 15, verified: true, description: 'Reliable corporate gifting and event kits, with rapid nationwide fulfillment.', accent: '#ff6a00', products: [
    { name: 'Custom Backpack', price: 14, description: 'Recycled canvas with logo patch.', icon: 'bag' },
    { name: 'Softcover Notebook', price: 5, description: 'Dot grid, 160 pages.', icon: 'book' },
    { name: 'Premium Pen', price: 3, description: 'Matte metal ballpoint.', icon: 'pen' },
    { name: 'Steel Water Bottle', price: 11, description: 'Vacuum insulated, 500 ml.', icon: 'bottle' },
  ] },
  { id: 'corporatehub', name: 'CorporateHub', shortName: 'Vendor C', category: 'Branded merchandise', amount: 480, deliveryDays: 3, rating: 4.5, reviewCount: 687, shipping: 'Free shipping', minOrder: 25, verified: true, description: 'Fast-turn custom merchandise for growing teams.', accent: '#1a9c72', products: [] },
  { id: 'printverse', name: 'PrintVerse', shortName: 'PrintVerse', category: 'Print & branding', amount: 398, deliveryDays: 5, rating: 4.7, reviewCount: 940, shipping: 'Free shipping over $300', minOrder: 10, verified: true, description: 'Custom print production for campaigns, launches, and events.', accent: '#ab59db', products: [] },
  { id: 'giftworld', name: 'GiftWorld', shortName: 'GiftWorld', category: 'Corporate gifting', amount: 510, deliveryDays: 5, rating: 4.4, reviewCount: 524, shipping: '$12 shipping', minOrder: 20, verified: false, description: 'Curated welcome gifts and team appreciation packages.', accent: '#db7a49', products: [] },
  { id: 'thekitstore', name: 'TheKitStore', shortName: 'TheKitStore', category: 'Event supplies', amount: 455, deliveryDays: 4, rating: 4.7, reviewCount: 706, shipping: 'Free shipping', minOrder: 20, verified: true, description: 'Ready-to-ship conference kits designed for productive events.', accent: '#4b91b9', products: [] },
]

export const transactions: Transaction[] = [
  { id: 'PACT-1048', goal: '30 conference kits under $500', vendorId: 'officekart', amount: 465, status: 'Completed', delivery: '4 days', date: 'Oct 03, 2026' },
  { id: 'PACT-1047', goal: 'Team welcome boxes for 12', vendorId: 'thekitstore', amount: 384, status: 'Processing', delivery: '3 days', date: 'Oct 02, 2026' },
  { id: 'PACT-1046', goal: 'Custom t-shirts for offsite', vendorId: 'printverse', amount: 612, status: 'Pending', delivery: '7 days', date: 'Oct 01, 2026' },
  { id: 'PACT-1045', goal: 'New hire desk essentials', vendorId: 'corporatehub', amount: 286, status: 'Completed', delivery: '2 days', date: 'Sep 28, 2026' },
  { id: 'PACT-1044', goal: 'Executive thank-you gifts', vendorId: 'giftworld', amount: 720, status: 'Failed', delivery: '—', date: 'Sep 25, 2026' },
]

export const transactionTimeline = [
  ['Request received', '10:02 AM'], ['Requirements parsed', '10:02 AM'], ['Vendors analyzed', '10:03 AM'], ['Best option selected', '10:04 AM'], ['PayPal order created', '10:05 AM'], ['Payment approved', '10:06 AM'], ['Webhook received', '10:06 AM'], ['Goal completed', '10:06 AM'],
]
