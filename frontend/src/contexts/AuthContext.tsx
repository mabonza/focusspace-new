import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { AuthUser } from '../types'

const BASE_URL = (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '')
const TOKEN_KEY = 'fs_token'

interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  institution: string
  country: string
}

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  loading: boolean
  isAuthenticated: boolean
  login: (identifier: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  hasRole: (role: string | string[]) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [loading, setLoading] = useState(true)

  const apiFetch = useCallback(
    async (path: string, options: RequestInit = {}) => {
      const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(options.headers || {}),
        },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message || data?.message || 'Request failed')
      return data
    },
    [token]
  )

  const refreshUser = useCallback(async () => {
    const stored = localStorage.getItem(TOKEN_KEY)
    if (!stored) { setLoading(false); return }
    try {
      const res = await fetch(`${BASE_URL}/api/users/me?populate=*`, {
        headers: { Authorization: `Bearer ${stored}`, 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(8000),
      })
      if (!res.ok) { localStorage.removeItem(TOKEN_KEY); setToken(null); setUser(null); return }
      const data = await res.json()
      setUser(data)
    } catch {
      localStorage.removeItem(TOKEN_KEY)
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refreshUser() }, [refreshUser])

  const login = useCallback(async (identifier: string, password: string) => {
    const data = await fetch(`${BASE_URL}/api/auth/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    }).then(async (r) => {
      const json = await r.json()
      if (!r.ok) throw new Error(json?.error?.message || 'Login failed')
      return json
    })
    localStorage.setItem(TOKEN_KEY, data.jwt)
    setToken(data.jwt)
    setUser(data.user)
  }, [])

  const register = useCallback(async (formData: RegisterData) => {
    // Step 1: create account
    const data = await fetch(`${BASE_URL}/api/auth/local/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: formData.email,
        email: formData.email,
        password: formData.password,
      }),
    }).then(async (r) => {
      const json = await r.json()
      if (!r.ok) throw new Error(json?.error?.message || 'Registration failed')
      return json
    })

    const jwt = data.jwt
    localStorage.setItem(TOKEN_KEY, jwt)
    setToken(jwt)

    // Step 2: update profile with extra fields
    try {
      const updated = await fetch(`${BASE_URL}/api/users/${data.user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone || '',
          institution: formData.institution,
          country: formData.country,
          userRole: 'attendee',
        }),
      }).then((r) => r.json())
      setUser({ ...data.user, ...updated })
    } catch {
      setUser(data.user)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const hasRole = useCallback(
    (role: string | string[]) => {
      if (!user) return false
      const roles = Array.isArray(role) ? role : [role]
      return roles.includes(user.userRole)
    },
    [user]
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
