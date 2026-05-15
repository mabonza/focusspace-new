import { useEffect, useState, useCallback } from 'react'
import { Search, Users, X, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { listUsers, updateUserRole, type ManagedUser, type UserRole } from '../../services/userManagement'
import EmptyState from '../../components/dashboard/EmptyState'

const ROLES: UserRole[] = ['attendee', 'presenter', 'reviewer', 'organizer', 'admin']

const ROLE_COLOR: Record<UserRole, string> = {
  attendee: 'bg-gray-100 text-gray-600',
  presenter: 'bg-blue-50 text-blue-700',
  reviewer: 'bg-purple-50 text-purple-700',
  organizer: 'bg-amber-50 text-amber-700',
  admin: 'bg-red-50 text-red-700',
}

const PAGE_SIZE = 15

function RoleSelect({
  user,
  onChanged,
}: {
  user: ManagedUser
  onChanged: (id: number, role: UserRole) => void
}) {
  const { token } = useAuth()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as UserRole
    if (newRole === user.userRole) return
    setSaving(true)
    setError('')
    try {
      await updateUserRole(token!, user.id, newRole)
      onChanged(user.id, newRole)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="relative">
      <div className={`flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-xs font-semibold ${ROLE_COLOR[user.userRole]}`}>
        <select
          value={user.userRole}
          onChange={handleChange}
          disabled={saving}
          className="appearance-none bg-transparent capitalize focus:outline-none cursor-pointer pr-4"
        >
          {ROLES.map((r) => (
            <option key={r} value={r} className="capitalize bg-white text-charcoal">{r}</option>
          ))}
        </select>
        <ChevronDown size={11} className="pointer-events-none absolute right-2" />
      </div>
      {error && <p className="text-red-500 text-[10px] mt-0.5 absolute whitespace-nowrap">{error}</p>}
    </div>
  )
}

export default function AdminUsers() {
  const { token } = useAuth()
  const [users, setUsers] = useState<ManagedUser[]>([])
  const [total, setTotal] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const res = await listUsers(token, {
        search,
        role: roleFilter === 'all' ? '' : roleFilter,
        page,
        pageSize: PAGE_SIZE,
      })
      setUsers(res.data)
      setTotal(res.meta.total)
      setPageCount(res.meta.pageCount)
    } finally {
      setLoading(false)
    }
  }, [token, search, roleFilter, page])

  useEffect(() => { load() }, [load])

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1) }, [search, roleFilter])

  const handleRoleChanged = (id: number, role: UserRole) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, userRole: role } : u))
  }

  const displayName = (u: ManagedUser) =>
    u.firstName ? `${u.firstName} ${u.lastName ?? ''}`.trim() : u.email

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or institution…"
            className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-primary transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Role filter */}
        <div className="flex flex-wrap items-center gap-2">
          {(['all', ...ROLES] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`text-xs px-3 py-1.5 rounded-sm font-semibold capitalize transition-colors ${
                roleFilter === r
                  ? 'bg-primary text-white'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-primary/30'
              }`}
            >
              {r === 'all' ? `All (${total})` : r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="h-14 bg-white border border-gray-100 rounded-sm animate-pulse" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <EmptyState icon={Users} title="No users found" description="Try adjusting your search or filter." />
      ) : (
        <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-gray-400">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-gray-400 hidden sm:table-cell">Institution</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-gray-400 hidden md:table-cell">Country</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-gray-400 hidden lg:table-cell">Joined</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors last:border-0"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-charcoal text-sm">{displayName(u)}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 hidden sm:table-cell">
                    {u.institution || <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell">
                    {u.country || <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 hidden lg:table-cell">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <RoleSelect user={u} onChanged={handleRoleChanged} />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-xs text-gray-400">
            Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, total)} of {total} users
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-sm disabled:opacity-40 hover:border-primary/30 transition-colors"
            >
              Previous
            </button>
            <span className="px-3 py-1.5 text-xs text-gray-500">
              {page} / {pageCount}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={page === pageCount}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-sm disabled:opacity-40 hover:border-primary/30 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
