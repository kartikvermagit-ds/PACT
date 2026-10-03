import type { PaymentResult } from '../types'

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

export const paymentService = {
  createPayPalOrder: async (): Promise<{ id: string }> => { await wait(350); return { id: 'ORDER-9RX58231' } },
  capturePayPalOrder: async (): Promise<PaymentResult> => { await wait(1100); return { orderId: 'ORDER-9RX58231', captureId: '6KT23510M421', status: 'COMPLETED' } },
  getPayPalOrderStatus: async (): Promise<PaymentResult> => ({ orderId: 'ORDER-9RX58231', captureId: '6KT23510M421', status: 'COMPLETED' }),
}
