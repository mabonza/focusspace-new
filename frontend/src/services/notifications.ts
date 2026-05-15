import type { Notification } from '../types'

const BASE_URL = (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '')

function headers(token: string): HeadersInit {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

export async function getMyNotifications(token: string, userId?: number): Promise<Notification[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/api/notifications`,
      { headers: headers(token) }
    )
    if (!res.ok) return []
    const json = await res.json()
    return json.data ?? []
  } catch { return [] }
}

export async function markAsRead(token: string, id: number): Promise<void> {
  await fetch(`${BASE_URL}/api/notifications/${id}`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify({ data: { readStatus: true } }),
  })
}

export async function markAllAsRead(token: string, userId?: number): Promise<void> {
  const notifications = await getMyNotifications(token)
  const unread = notifications.filter((n) => !n.readStatus)
  await Promise.all(unread.map((n) => markAsRead(token, n.id)))
}

export async function broadcastNotification(
  token: string,
  data: { title: string; message: string; type: string; targetUserId?: number }
): Promise<{ sent: number }> {
  const res = await fetch(`${BASE_URL}/api/notifications/broadcast`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error?.message ?? 'Broadcast failed')
  return json
}

export async function createNotification(
  token: string,
  data: {
    title: string
    message: string
    type: string
    user: number
  }
): Promise<void> {
  await fetch(`${BASE_URL}/api/notifications`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ data: { title: data.title, message: data.message, type: data.type, readStatus: false, user: { connect: [data.user] } } }),
  }).catch(() => null)
}
