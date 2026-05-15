import { useEffect, useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { TrendingUp, Users, DollarSign, FileText, Award, UserCheck, BarChart2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import {
  getAnalyticsOverview,
  getRegistrationsByDate,
  getPaymentsByConference,
  getCountryDistribution,
} from '../../services/analytics'
import type { AnalyticsOverview } from '../../types'

const PRIMARY = '#7c2d49'
const GOLD = '#d4af37'
const COLORS = [PRIMARY, GOLD, '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  color?: string
  index: number
}

function StatCard({ title, value, icon: Icon, color = 'text-primary', index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="bg-white border border-gray-100 rounded-sm p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">{title}</p>
        <div className={`w-8 h-8 rounded-sm bg-gray-50 flex items-center justify-center ${color}`}>
          <Icon size={16} />
        </div>
      </div>
      <p className="text-2xl font-bold text-charcoal">{value}</p>
    </motion.div>
  )
}

export default function Analytics() {
  const { token } = useAuth()
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null)
  const [regsByDate, setRegsByDate] = useState<{ date: string; count: number }[]>([])
  const [pmtsByConf, setPmtsByConf] = useState<{ label: string; total: number; count: number }[]>([])
  const [countries, setCountries] = useState<{ country: string; count: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    Promise.all([
      getAnalyticsOverview(token),
      getRegistrationsByDate(token),
      getPaymentsByConference(token),
      getCountryDistribution(token),
    ]).then(([ov, regs, pmts, ctrs]) => {
      setOverview(ov)
      setRegsByDate(regs)
      setPmtsByConf(pmts)
      setCountries(ctrs)
      setLoading(false)
    })
  }, [token])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => <div key={n} className="h-24 bg-white border border-gray-100 rounded-sm animate-pulse" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => <div key={n} className="h-64 bg-white border border-gray-100 rounded-sm animate-pulse" />)}
        </div>
      </div>
    )
  }

  const stats = overview ? [
    { title: 'Total Registrations', value: overview.totalRegistrations, icon: Users, color: 'text-blue-500' },
    { title: 'Total Revenue (USD)', value: `$${overview.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-500' },
    { title: 'Abstracts Submitted', value: overview.totalAbstracts, icon: FileText, color: 'text-primary' },
    { title: 'Pending Payments', value: overview.pendingPayments, icon: TrendingUp, color: overview.pendingPayments > 0 ? 'text-orange-500' : 'text-gray-400' },
    { title: 'Certificates Issued', value: overview.totalCertificates, icon: Award, color: 'text-gold' },
    { title: 'Checked-in Delegates', value: overview.totalAttendees, icon: UserCheck, color: 'text-teal-500' },
    { title: 'Reviews Submitted', value: overview.totalReviews, icon: BarChart2, color: 'text-purple-500' },
    { title: 'Conferences', value: overview.totalConferences, icon: Users, color: 'text-charcoal' },
  ] : []

  return (
    <div className="space-y-6">
      {/* Stat grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <StatCard key={s.title} {...s} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registrations over time */}
        <div className="bg-white border border-gray-100 rounded-sm p-5">
          <h3 className="font-semibold text-charcoal mb-4 text-sm">Registrations Over Time</h3>
          {regsByDate.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={regsByDate} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PRIMARY} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={PRIMARY} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 2, border: '1px solid #e5e7eb' }} />
                <Area type="monotone" dataKey="count" stroke={PRIMARY} strokeWidth={2} fill="url(#regGrad)" name="Registrations" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Payments by conference */}
        <div className="bg-white border border-gray-100 rounded-sm p-5">
          <h3 className="font-semibold text-charcoal mb-4 text-sm">Revenue by Conference</h3>
          {pmtsByConf.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No payments yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={pmtsByConf} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 2, border: '1px solid #e5e7eb' }}
                  formatter={(v) => [`$${Number(v ?? 0).toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="total" fill={PRIMARY} radius={[2, 2, 0, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Abstract status breakdown */}
        {overview?.abstractBreakdown && (
          <div className="bg-white border border-gray-100 rounded-sm p-5">
            <h3 className="font-semibold text-charcoal mb-4 text-sm">Abstract Status Breakdown</h3>
            <div className="flex flex-col lg:flex-row items-center gap-4">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={overview.abstractBreakdown.filter((d) => d.count > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="count"
                    nameKey="status"
                  >
                    {overview.abstractBreakdown.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 2 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Country distribution */}
        <div className="bg-white border border-gray-100 rounded-sm p-5">
          <h3 className="font-semibold text-charcoal mb-4 text-sm">Delegates by Country (Top 10)</h3>
          {countries.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No data yet</div>
          ) : (
            <div className="space-y-2">
              {countries.slice(0, 10).map((c, i) => {
                const max = countries[0]?.count ?? 1
                return (
                  <div key={c.country} className="flex items-center gap-3 text-sm">
                    <span className="text-xs text-gray-400 w-4 shrink-0">{i + 1}</span>
                    <span className="text-charcoal w-32 shrink-0 truncate">{c.country}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full"
                        style={{ width: `${(c.count / max) * 100}%`, background: COLORS[i % COLORS.length] }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-6 text-right shrink-0">{c.count}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
