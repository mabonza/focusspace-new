const BASE_URL = (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '')

async function post<T>(path: string, body: unknown, token?: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error?.message || data?.message || 'Request failed')
  return data as T
}

export async function forgotPassword(email: string): Promise<void> {
  await post('/api/auth/forgot-password', { email })
}

export async function resetPassword(
  code: string,
  password: string,
  passwordConfirmation: string
): Promise<void> {
  await post('/api/auth/reset-password', { code, password, passwordConfirmation })
}
