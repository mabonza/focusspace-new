import { useEffect, useState } from 'react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  expired: boolean
}

function calcTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  }
}

interface Props {
  targetDate: string
  label?: string
  variant?: 'light' | 'dark'
  compact?: boolean
}

export default function CountdownTimer({
  targetDate,
  label = 'Conference starts in',
  variant = 'dark',
  compact = false,
}: Props) {
  const [time, setTime] = useState<TimeLeft>(calcTimeLeft(new Date(targetDate)))

  useEffect(() => {
    const id = setInterval(() => setTime(calcTimeLeft(new Date(targetDate))), 1000)
    return () => clearInterval(id)
  }, [targetDate])

  if (time.expired) {
    return (
      <span className={`text-sm font-semibold ${variant === 'light' ? 'text-white/70' : 'text-gray-400'}`}>
        Conference underway
      </span>
    )
  }

  // Compact: inline "Xd Xh Xm Xs" for use inside existing layouts
  if (compact) {
    const numClass = variant === 'light' ? 'text-white font-bold tabular-nums' : 'text-primary font-bold tabular-nums'
    const unitClass = variant === 'light' ? 'text-white/60 text-xs' : 'text-gray-400 text-xs'
    return (
      <span className="inline-flex items-center gap-2">
        {[
          { v: time.days, u: 'd' },
          { v: time.hours, u: 'h' },
          { v: time.minutes, u: 'm' },
          { v: time.seconds, u: 's' },
        ].map(({ v, u }) => (
          <span key={u} className="inline-flex items-baseline gap-0.5">
            <span className={numClass}>{String(v).padStart(2, '0')}</span>
            <span className={unitClass}>{u}</span>
          </span>
        ))}
      </span>
    )
  }

  // Full block countdown
  const bg = variant === 'light'
    ? 'bg-white/15 backdrop-blur-sm border border-white/20'
    : 'bg-primary/10 border border-primary/20'
  const numColor = variant === 'light' ? 'text-white' : 'text-primary'
  const unitColor = variant === 'light' ? 'text-white/60' : 'text-gray-400'
  const headingColor = variant === 'light' ? 'text-white/80' : 'text-gray-500'
  const sepColor = variant === 'light' ? 'text-white/40' : 'text-primary/30'

  return (
    <div>
      {label && (
        <p className={`text-[11px] font-bold uppercase tracking-widest mb-3 ${headingColor}`}>{label}</p>
      )}
      <div className="flex items-start gap-1.5">
        {[
          { value: time.days, unit: 'Days' },
          { value: time.hours, unit: 'Hrs' },
          { value: time.minutes, unit: 'Min' },
          { value: time.seconds, unit: 'Sec' },
        ].map(({ value, unit }, i) => (
          <div key={unit} className="flex items-start gap-1.5">
            <div className={`${bg} rounded-sm px-3 py-2 min-w-[54px] text-center`}>
              <div className={`text-2xl font-bold tabular-nums leading-none ${numColor}`}>
                {String(value).padStart(2, '0')}
              </div>
              <div className={`text-[9px] uppercase tracking-widest mt-1 font-semibold ${unitColor}`}>{unit}</div>
            </div>
            {i < 3 && (
              <span className={`text-lg font-bold mt-1.5 ${sepColor}`}>:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
