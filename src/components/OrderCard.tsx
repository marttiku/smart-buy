import { Trophy, Clock, Package } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Order } from '../data/mockData'
import CountdownTimer from './CountdownTimer'

interface OrderCardProps {
  order: Order
}

export default function OrderCard({ order }: OrderCardProps) {
  const navigate = useNavigate()

  const statusConfig = {
    active: { label: 'In window', color: 'text-indigo-400', bg: 'bg-indigo-500/10', icon: Clock },
    completed: { label: 'Completed', color: 'text-gray-400', bg: 'bg-gray-500/10', icon: Package },
    won: { label: 'Price improved!', color: 'text-green-400', bg: 'bg-green-500/10', icon: Trophy },
  }

  const cfg = statusConfig[order.status]
  const StatusIcon = cfg.icon

  return (
    <button
      onClick={() => {
        if (order.status === 'active') navigate(`/order/${order.id}`)
        else if (order.status === 'won') navigate(`/order/${order.id}/win`)
      }}
      className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-left hover:border-gray-700 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-100 truncate">{order.productName}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color} ${cfg.bg}`}>
              <StatusIcon className="w-3 h-3" />
              {cfg.label}
            </span>
          </div>
        </div>
        <div className="text-right">
          {order.status === 'won' && order.finalPrice ? (
            <>
              <p className="text-sm font-bold text-green-400">€{order.finalPrice.toFixed(2)}</p>
              <p className="text-xs text-gray-500 line-through">€{order.lockedPrice}</p>
              <p className="text-xs text-green-400 mt-0.5">+€{order.creditEarned.toFixed(2)} credit</p>
            </>
          ) : (
            <p className="text-sm font-bold text-gray-100">€{order.lockedPrice}</p>
          )}
        </div>
      </div>

      {order.status === 'active' && (
        <div className="mt-3 pt-3 border-t border-gray-800">
          <CountdownTimer endsAt={order.windowEndsAt} />
        </div>
      )}
    </button>
  )
}
