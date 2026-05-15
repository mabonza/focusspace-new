import type { Payment } from '../types'

const BASE = (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '')

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` }
}
function jsonHeaders(token: string): HeadersInit {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

export async function getMyPayments(token: string, _userId?: number): Promise<Payment[]> {
  try {
    const res = await fetch(`${BASE}/api/payments/my`, { headers: authHeaders(token) })
    if (!res.ok) return []
    const json = await res.json()
    return json.data ?? []
  } catch { return [] }
}

export async function getAllPayments(token: string): Promise<Payment[]> {
  try {
    const res = await fetch(
      `${BASE}/api/payments?populate=user,invoice,registration,registration.conference&sort=createdAt:desc&pagination[pageSize]=200`,
      { headers: authHeaders(token) }
    )
    if (!res.ok) return []
    const json = await res.json()
    return json.data ?? []
  } catch { return [] }
}

export async function submitPaymentProof(
  token: string,
  data: {
    invoiceId: number
    registrationId: number
    userId: number
    amount: number
    currency: string
    paymentMethod: string
    paymentReference?: string
    proofFile?: File
  }
): Promise<Payment> {
  let paymentProofId: number | undefined

  // Upload file first if provided
  if (data.proofFile) {
    const formData = new FormData()
    formData.append('files', data.proofFile)
    const uploadRes = await fetch(`${BASE}/api/upload`, {
      method: 'POST',
      headers: authHeaders(token),
      body: formData,
    })
    if (!uploadRes.ok) throw new Error('File upload failed')
    const uploaded = await uploadRes.json()
    paymentProofId = uploaded[0]?.id
  }

  const res = await fetch(`${BASE}/api/payments`, {
    method: 'POST',
    headers: jsonHeaders(token),
    body: JSON.stringify({
      data: {
        amount: data.amount,
        currency: data.currency,
        paymentMethod: data.paymentMethod,
        paymentReference: data.paymentReference,
        status: 'under-review',
        user: { connect: [data.userId] },
        invoice: { connect: [data.invoiceId] },
        registration: { connect: [data.registrationId] },
        ...(paymentProofId ? { paymentProof: paymentProofId } : {}),
      },
    }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error?.message ?? 'Payment submission failed')
  return json.data
}

export async function verifyPayment(token: string, paymentId: number): Promise<void> {
  const res = await fetch(`${BASE}/api/payments/${paymentId}/verify`, {
    method: 'PUT',
    headers: jsonHeaders(token),
  })
  if (!res.ok) {
    const json = await res.json()
    throw new Error(json?.error?.message ?? 'Verification failed')
  }
}

export async function rejectPayment(token: string, paymentId: number, reason: string): Promise<void> {
  const res = await fetch(`${BASE}/api/payments/${paymentId}/reject`, {
    method: 'PUT',
    headers: jsonHeaders(token),
    body: JSON.stringify({ reason }),
  })
  if (!res.ok) {
    const json = await res.json()
    throw new Error(json?.error?.message ?? 'Rejection failed')
  }
}
