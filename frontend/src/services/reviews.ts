import type { Review } from '../types'

const BASE_URL = (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '')

function headers(token: string): HeadersInit {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

export async function getMyReviews(token: string, reviewerId: number): Promise<Review[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/api/reviews?filters[reviewer][id][$eq]=${reviewerId}&populate=abstract.conference&sort=createdAt:desc&pagination[pageSize]=50`,
      { headers: headers(token) }
    )
    if (!res.ok) return []
    const json = await res.json()
    return json.data ?? []
  } catch { return [] }
}

export async function submitReview(
  token: string,
  data: {
    abstract: number
    reviewer: number
    score: number
    comments: string
    recommendation: 'accept' | 'reject' | 'revise'
  }
): Promise<Review> {
  const res = await fetch(`${BASE_URL}/api/reviews`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({
      data: {
        score: data.score,
        comments: data.comments,
        recommendation: data.recommendation,
        submittedAt: new Date().toISOString(),
        abstract: data.abstract,
        reviewer: data.reviewer,
      },
    }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error?.message || 'Failed to submit review')
  return json.data
}

export async function updateReview(
  token: string,
  id: number,
  data: Partial<{ score: number; comments: string; recommendation: string }>
): Promise<Review> {
  const res = await fetch(`${BASE_URL}/api/reviews/${id}`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify({ data }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error?.message || 'Failed to update review')
  return json.data
}
