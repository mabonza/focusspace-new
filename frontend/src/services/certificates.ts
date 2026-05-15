import type { Certificate, CertificateVerification } from '../types'

const BASE = (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '')

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` }
}

export async function getMyCertificates(token: string, userId: number): Promise<Certificate[]> {
  try {
    const res = await fetch(
      `${BASE}/api/certificates?filters[user][id][$eq]=${userId}&populate=conference&sort=createdAt:desc`,
      { headers: authHeaders(token) }
    )
    if (!res.ok) return []
    const json = await res.json()
    return json.data ?? []
  } catch { return [] }
}

export async function verifyCertificate(code: string): Promise<CertificateVerification | null> {
  try {
    const res = await fetch(`${BASE}/api/certificates/verify/${code}`)
    if (!res.ok) return null
    const json = await res.json()
    return json.data ?? null
  } catch { return null }
}

export async function issueCertificate(
  token: string,
  userId: number,
  conferenceId: number,
  certificateType: string
): Promise<Certificate> {
  const res = await fetch(`${BASE}/api/certificates/issue`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ userId, conferenceId, certificateType }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error?.message ?? 'Certificate issuance failed')
  return json.data
}
