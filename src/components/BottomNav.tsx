import { Home, ShoppingBag, Wallet, Bell } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { useApp } from '../store/appStore'

export default function BottomNav() {
  const { unreadCount, orders } = useApp()
  const location = useLocation()
  const activeOrderCount = orders.filter(o => o.status === 'active').length

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/dashboard', icon: Wallet, label: 'Credits' },
    { to: '/notifications', icon: Bell, label: 'Alerts', badge: unreadCount },
  ]

  const isOrdersActive = location.pathname.startsWith('/order')

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-gray-900 border-t border-gray-800 flex z-50">
      {navItems.map(({ to, icon: Icon, label, badge }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
              isActive ? 'text-indigo-400' : 'text-gray-400 hover:text-gray-100'
            }`
          }
        >
          <div className="relative">
            <Icon className="w-5 h-5" />
            {badge != null && badge > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5">
                {badge}
              </span>
            )}
          </div>
          <span>{label}</span>
        </NavLink>
      ))}

      {/* Orders tab — shows active count badge */}
      <button
        onClick={() => {
          const activeOrder = orders.find(o => o.status === 'active')
          if (activeOrder) window.location.href = `/order/${activeOrder.id}`
          else window.location.href = '/dashboard'
        }}
        className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
          isOrdersActive ? 'text-indigo-400' : 'text-gray-400 hover:text-gray-100'
        }`}
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          {activeOrderCount > 0 && (
            <span className="absolute -top-1 -right-1.5 bg-green-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5">
              {activeOrderCount}
            </span>
          )}
        </div>
        <span>Orders</span>
      </button>
    </nav>
  )
}
