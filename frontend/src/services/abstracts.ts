import type { Abstract } from '../types'

const BASE_URL = (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '')

function headers(token: string): HeadersInit {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

export async function getMyAbstracts(token: string): Promise<Abstract[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/abstracts/my`, { headers: headers(token) })
    if (!res.ok) return []
    const json = await res.json()
    return json.data ?? []
  } catch { return [] }
}

export async function getAbstractById(token: string, id: number): Promise<Abstract | null> {
  try {
    const res = await fetch(
      `${BASE_URL}/api/abstracts/${id}?populate=conference,user,reviews.reviewer`,
      { headers: headers(token) }
    )
    if (!res.ok) return null
    const json = await res.json()
    return json.data ?? null
  } catch { return null }
}

export async function createAbstract(
  token: string,
  data: {
    title: string
    abstractText: string
    keywords: string
    conference: number
    presentationType: string
    status: 'draft' | 'submitted'
    subtheme?: string
    coAuthors?: string
    institution?: string
    documentUpload?: number
  }
): Promise<Abstract> {
  const body: Record<string, unknown> = {
    title: data.title,
    abstractText: data.abstractText,
    keywords: data.keywords,
    presentationType: data.presentationType,
    status: data.status,
    conference: data.conference,
  }
  if (data.subtheme) body.subtheme = data.subtheme
  if (data.coAuthors) body.coAuthors = data.coAuthors
  if (data.institution) body.institution = data.institution
  if (data.documentUpload !== undefined) body.documentUpload = data.documentUpload

  const res = await fetch(`${BASE_URL}/api/abstracts`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ data: body }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error?.message || 'Failed to submit abstract')
  return json.data
}

export async function updateAbstract(
  token: string,
  id: number,
  data: Partial<{
    title: string
    abstractText: string
    keywords: string
    presentationType: string
    status: string
    subtheme: string
    coAuthors: string
    institution: string
    documentUpload: number
  }>
): Promise<Abstract> {
  const res = await fetch(`${BASE_URL}/api/abstracts/${id}`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify({ data }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error?.message || 'Failed to update abstract')
  return json.data
}

export async function withdrawAbstract(token: string, id: number): Promise<void> {
  await fetch(`${BASE_URL}/api/abstracts/${id}`, {
    method: 'DELETE',
    headers: headers(token),
  })
}

// Reviewer: get abstracts assigned to this reviewer
export async function getAssignedAbstracts(token: string, reviewerId: number): Promise<Abstract[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/api/abstracts?reviewerId=${reviewerId}`,
      { headers: headers(token) }
    )
    if (!res.ok) return []
    const json = await res.json()
    return json.data ?? []
  } catch { return [] }
}

// Admin: get all abstracts (uses overridden find that bypasses relation validation)
export async function getAllAbstracts(
  token: string,
  conferenceId?: number
): Promise<Abstract[]> {
  const params = new URLSearchParams()
  if (conferenceId) params.set('conferenceId', String(conferenceId))
  try {
    const res = await fetch(
      `${BASE_URL}/api/abstracts?${params.toString()}`,
      { headers: headers(token) }
    )
    if (!res.ok) return []
    const json = await res.json()
    return json.data ?? []
  } catch { return [] }
}

export interface ReviewerOption {
  id: number
  firstName?: string
  lastName?: string
  email: string
  userRole: string
}

export async function getReviewers(token: string): Promise<ReviewerOption[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/abstracts/reviewers`, { headers: headers(token) })
    if (!res.ok) return []
    const json = await res.json()
    return json.data ?? []
  } catch { return [] }
}

export async function assignReviewer(token: string, abstractId: number, reviewerId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/abstracts/${abstractId}/assign-reviewer`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify({ reviewerId }),
  })
  if (!res.ok) {
    const json = await res.json().catch(() => ({}))
    throw new Error(json?.error?.message || 'Failed to assign reviewer')
  }
}

export async function downloadAbstractsCsv(token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/abstracts/export/csv`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Export failed')
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'abstracts.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export async function updateAbstractStatus(
  token: string,
  id: number,
  status: string,
  adminComments?: string
): Promise<void> {
  await fetch(`${BASE_URL}/api/abstracts/${id}`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify({ data: { status, ...(adminComments ? { adminComments } : {}) } }),
  })
}
