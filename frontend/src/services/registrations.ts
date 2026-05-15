import type { ConferenceRegistration } from '../types'

const BASE_URL = (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '')

function headers(token: string): HeadersInit {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

// Conference fee constants (ZAR)
export const CONFERENCE_FEE = 7250
export const PRECONFERENCE_FEE = 2000

export async function getMyRegistrations(token: string, userId?: number): Promise<ConferenceRegistration[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/api/conference-registrations`,
      { headers: headers(token) }
    )
    if (!res.ok) return []
    const json = await res.json()
    return json.data ?? []
  } catch { return [] }
}

export async function checkRegistration(
  token: string,
  conferenceId: number
): Promise<ConferenceRegistration | null> {
  try {
    const res = await fetch(
      `${BASE_URL}/api/conference-registrations/check?conferenceId=${conferenceId}`,
      { headers: headers(token) }
    )
    if (!res.ok) return null
    const json = await res.json()
    return json.data ?? null
  } catch { return null }
}

export async function createRegistration(
  token: string,
  data: {
    conference: number
    titlePrefix?: string
    phone?: string
    institution?: string
    billingAddress1?: string
    billingAddress2?: string
    city?: string
    stateProvince?: string
    postalCode?: string
    country?: string
    vatNumber?: string
    preconferenceAttendance?: boolean
    abstractSubmission?: boolean
  }
): Promise<ConferenceRegistration> {
  const preconferenceAttendance = !!data.preconferenceAttendance
  const conferenceFee = CONFERENCE_FEE
  const preconferenceFee = preconferenceAttendance ? PRECONFERENCE_FEE : 0

  const res = await fetch(`${BASE_URL}/api/conference-registrations`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({
      data: {
        conference: data.conference,
        titlePrefix: data.titlePrefix,
        phone: data.phone,
        institution: data.institution,
        billingAddress1: data.billingAddress1,
        billingAddress2: data.billingAddress2,
        city: data.city,
        stateProvince: data.stateProvince,
        postalCode: data.postalCode,
        country: data.country,
        vatNumber: data.vatNumber,
        preconferenceAttendance,
        abstractSubmission: !!data.abstractSubmission,
        conferenceFee,
        preconferenceFee,
      },
    }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error?.message || 'Registration failed')
  return json.data
}
