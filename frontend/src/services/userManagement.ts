const BASE_URL = (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '')

function headers(token: string): HeadersInit {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

export type UserRole = 'attendee' | 'presenter' | 'reviewer' | 'organizer' | 'admin'

export interface ManagedUser {
  id: number
  firstName?: string
  lastName?: string
  email: string
  userRole: UserRole
  institution?: string
  country?: string
  createdAt?: string
  confirmed?: boolean
}

export interface UserListResponse {
  data: ManagedUser[]
  meta: { total: number; page: number; pageSize: number; pageCount: number }
}

export async function listUsers(
  token: string,
  params: { search?: string; role?: string; page?: number; pageSize?: number }
): Promise<UserListResponse> {
  const q = new URLSearchParams()
  if (params.search) q.set('search', params.search)
  if (params.role) q.set('role', params.role)
  if (params.page) q.set('page', String(params.page))
  if (params.pageSize) q.set('pageSize', String(params.pageSize))

  const res = await fetch(`${BASE_URL}/api/user-management/users?${q}`, { headers: headers(token) })
  if (!res.ok) throw new Error('Failed to load users')
  return res.json()
}

export async function updateUserRole(token: string, userId: number, userRole: UserRole): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/user-management/users/${userId}/role`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify({ userRole }),
  })
  if (!res.ok) {
    const json = await res.json().catch(() => ({}))
    throw new Error(json?.error?.message || 'Failed to update role')
  }
}
