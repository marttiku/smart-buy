interface DemandBarProps {
  percent: number
  buyerCount: number
  className?: string
  showLabel?: boolean
  animate?: boolean
}

export default function DemandBar({ percent, buyerCount, className = '', showLabel = true, animate = false }: DemandBarProps) {
  const color =
    percent >= 80 ? 'bg-green-500' :
    percent >= 50 ? 'bg-indigo-500' :
    'bg-indigo-400'

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-400">{buyerCount} buyers joined</span>
          <span className="text-xs font-semibold" style={{ color: percent >= 80 ? '#22c55e' : '#818cf8' }}>
            {percent >= 80 ? 'High demand' : percent >= 50 ? 'Growing' : 'Building'}
          </span>
        </div>
      )}
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${color} ${animate ? 'animate-pulse' : ''}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  )
}
