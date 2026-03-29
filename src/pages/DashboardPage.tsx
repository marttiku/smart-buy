import { Wallet, Trophy, TrendingDown, ShoppingBag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../store/appStore'
import OrderCard from '../components/OrderCard'
import { OmnivaSymbol } from '../components/OmnivaLogo'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { creditBalance, totalSaved, orders } = useApp()

  const completedOrders = orders.filter(o => o.status === 'won' || o.status === 'completed')
  const activeOrders = orders.filter(o => o.status === 'active')
  const winCount = orders.filter(o => o.status === 'won').length

  return (
    <div>
      {/* Header */}
      <div className="px-5 pt-12 pb-5">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-gray-100">My Credits</h1>
          <OmnivaSymbol size={24} />
        </div>
        <p className="text-sm text-gray-400">Earned when prices improve</p>
      </div>

      {/* Credit balance card */}
      <div className="px-5 mb-5">
        <div className="bg-gradient-to-br from-indigo-600/20 to-indigo-800/10 border border-indigo-500/30 rounded-2xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wide mb-1">Available credit</p>
              <p className="text-5xl font-bold text-gray-100">€{creditBalance.toFixed(2)}</p>
              <p className="text-sm text-indigo-300 mt-1">Use on next SmartBuy purchase</p>
            </div>
            <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <button
            disabled
            className="w-full bg-indigo-600/30 text-indigo-300 font-semibold rounded-xl py-3 text-sm cursor-not-allowed opacity-70"
          >
            Apply credit at checkout (auto)
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="px-5 mb-5">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingDown className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-xl font-bold text-gray-100">€{totalSaved.toFixed(0)}</p>
            <p className="text-xs text-gray-500">Total saved</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Trophy className="w-4 h-4 text-yellow-400" />
            </div>
            <p className="text-xl font-bold text-gray-100">{winCount}</p>
            <p className="text-xs text-gray-500">Wins</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <ShoppingBag className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-xl font-bold text-gray-100">{orders.length}</p>
            <p className="text-xs text-gray-500">Orders</p>
          </div>
        </div>
      </div>

      {/* Active orders */}
      {activeOrders.length > 0 && (
        <div className="px-5 mb-5">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Active Orders</h2>
          <div className="flex flex-col gap-2">
            {activeOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>
      )}

      {/* Order history */}
      <div className="px-5 mb-5">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Order History</h2>
        {completedOrders.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl py-10 text-center">
            <ShoppingBag className="w-8 h-8 text-gray-700 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No completed orders yet</p>
            <button
              onClick={() => navigate('/category/electronics')}
              className="mt-3 text-indigo-400 text-sm font-medium"
            >
              Browse deals
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {completedOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>

      {/* Credit explainer */}
      <div className="px-5 pb-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">How credits work</p>
          <ul className="flex flex-col gap-1.5">
            {[
              'You buy at the current best price',
              'Omniva pools demand in your category',
              'If price improves, you earn the difference as credit',
              'Credit is applied automatically to your next order',
            ].map(item => (
              <li key={item} className="flex items-start gap-2 text-xs text-gray-400">
                <span className="text-indigo-400 mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
