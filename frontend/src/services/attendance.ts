import type { Attendance } from '../types'

const BASE = (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '')

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` }
}

export async function getConferenceAttendance(token: string, conferenceId: number): Promise<Attendance[]> {
  try {
    const res = await fetch(
      `${BASE}/api/attendances?filters[conference][id][$eq]=${conferenceId}&populate=user&sort=checkedInAt:desc&pagination[pageSize]=500`,
      { headers: authHeaders(token) }
    )
    if (!res.ok) return []
    const json = await res.json()
    return json.data ?? []
  } catch { return [] }
}

export async function checkinByQR(
  token: string,
  qrCode: string
): Promise<{ data: Attendance; user?: { firstName?: string; lastName?: string; email?: string }; conference?: { title?: string }; alreadyCheckedIn?: boolean }> {
  const res = await fetch(`${BASE}/api/attendances/checkin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ qrCode }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error?.message ?? 'Check-in failed')
  return json
}

export async function createAttendanceRecord(
  token: string,
  userId: number,
  conferenceId: number,
  qrCode: string
): Promise<Attendance> {
  const res = await fetch(`${BASE}/api/attendances`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      data: {
        qrCode,
        attendanceStatus: 'registered',
        user: userId,
        conference: conferenceId,
      },
    }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error?.message ?? 'Failed to create attendance record')
  return json.data
}
