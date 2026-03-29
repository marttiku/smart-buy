import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

interface CountdownTimerProps {
  endsAt: Date
  className?: string
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export default function CountdownTimer({ endsAt, className = '' }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    const calc = () => Math.max(0, Math.floor((endsAt.getTime() - Date.now()) / 1000))
    setRemaining(calc())
    const id = setInterval(() => setRemaining(calc()), 1000)
    return () => clearInterval(id)
  }, [endsAt])

  const h = Math.floor(remaining / 3600)
  const m = Math.floor((remaining % 3600) / 60)
  const s = remaining % 60

  const isUrgent = remaining < 3600

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <Clock className={`w-4 h-4 ${isUrgent ? 'text-orange-400' : 'text-gray-400'}`} />
      <span className={`font-mono font-semibold text-base tabular-nums ${isUrgent ? 'text-orange-400' : 'text-gray-200'}`}>
        {pad(h)}:{pad(m)}:{pad(s)}
      </span>
      <span className="text-xs text-gray-500">left</span>
    </div>
  )
}
