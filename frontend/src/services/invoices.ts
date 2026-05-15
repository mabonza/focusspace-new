import type { Invoice } from '../types'

const BASE_URL = (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '')

function headers(token: string): HeadersInit {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

export async function getMyInvoices(token: string, _userId?: number): Promise<Invoice[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/invoices/my`, { headers: headers(token) })
    if (!res.ok) return []
    const json = await res.json()
    return json.data ?? []
  } catch { return [] }
}

export async function getInvoiceById(token: string, id: number): Promise<Invoice | null> {
  try {
    const res = await fetch(
      `${BASE_URL}/api/invoices/${id}`,
      { headers: headers(token) }
    )
    if (!res.ok) return null
    const json = await res.json()
    return json.data ?? null
  } catch { return null }
}
