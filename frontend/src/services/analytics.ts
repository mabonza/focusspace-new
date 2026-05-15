import type { AnalyticsOverview } from '../types'

const BASE = (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '')

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` }
}

export async function getAnalyticsOverview(token: string): Promise<AnalyticsOverview | null> {
  try {
    const res = await fetch(`${BASE}/api/analytics/overview`, { headers: authHeaders(token) })
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

export async function getRegistrationsByDate(token: string): Promise<{ date: string; count: number }[]> {
  try {
    const res = await fetch(`${BASE}/api/analytics/registrations-by-date`, { headers: authHeaders(token) })
    if (!res.ok) return []
    const json = await res.json()
    return json.data ?? []
  } catch { return [] }
}

export async function getPaymentsByConference(token: string): Promise<{ label: string; total: number; count: number }[]> {
  try {
    const res = await fetch(`${BASE}/api/analytics/payments-by-conference`, { headers: authHeaders(token) })
    if (!res.ok) return []
    const json = await res.json()
    return json.data ?? []
  } catch { return [] }
}

export async function getCountryDistribution(token: string): Promise<{ country: string; count: number }[]> {
  try {
    const res = await fetch(`${BASE}/api/analytics/country-distribution`, { headers: authHeaders(token) })
    if (!res.ok) return []
    const json = await res.json()
    return json.data ?? []
  } catch { return [] }
}
