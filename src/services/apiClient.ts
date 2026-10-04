const API_BASE_URL = 'http://localhost:8000/api'

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers || {}),
  }

  try {
    const res = await fetch(url, { ...options, headers })
    if (!res.ok) {
      const errBody = await res.text()
      let parsed = errBody
      try {
        parsed = JSON.parse(errBody).detail || errBody
      } catch {}
      throw new Error(`API Error [${res.status}]: ${parsed}`)
    }
    return (await res.json()) as T
  } catch (err) {
    console.warn(`[PACT API] Request to ${endpoint} failed:`, err)
    throw err
  }
}

export interface ConfigStatus {
  status: string
  paypal_sandbox_configured: boolean
  groq_configured: boolean
  gemini_configured: boolean
  active_ai_provider: string
}

export const apiClient = {
  getConfigStatus: () => apiRequest<ConfigStatus>('/config/status'),
  getTransaction: (id: string) => apiRequest<any>(`/transactions/${id}`),
  listTransactions: () => apiRequest<any[]>('/transactions'),
  getOffers: () => apiRequest<any[]>('/goals/offers'),
}
