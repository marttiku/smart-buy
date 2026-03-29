import { useNavigate } from 'react-router-dom'
import { ChevronRight, Lock, TrendingDown } from 'lucide-react'
import { categories } from '../data/mockData'
import { useApp } from '../store/appStore'
import OrderCard from '../components/OrderCard'
import SearchBar from '../components/SearchBar'
import OmnivaLogo, { PoweredByOmniva } from '../components/OmnivaLogo'

export default function HomePage() {
  const navigate = useNavigate()
  const { orders, creditBalance } = useApp()
  const activeOrders = orders.filter(o => o.status === 'active')

  return (
    <div className="flex flex-col gap-0">
      {/* Header */}
      <div className="px-5 pt-12 pb-6 bg-gray-950">
        <div className="flex items-center justify-between mb-1">
          <div>
            <OmnivaLogo symbolSize={38} className="mb-2" />
            <p className="text-sm text-gray-400 mt-0.5">Lock price. Earn credit if it drops.</p>
          </div>
          {creditBalance > 0 && (
            <button
              onClick={() => navigate('/dashboard')}
              className="flex flex-col items-center bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2 hover:bg-green-500/15 transition-colors"
            >
              <span className="text-lg font-bold text-green-400">€{creditBalance.toFixed(2)}</span>
              <span className="text-xs text-green-500">credit</span>
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <SearchBar />

      {/* How it works — strip */}
      <div className="px-5 mb-5">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-7 h-7 bg-indigo-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-200">Lock price</p>
                <p className="text-xs text-gray-500">Buy at best rate</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-700 flex-shrink-0" />
            <div className="flex items-center gap-2 flex-1">
              <div className="w-7 h-7 bg-indigo-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingDown className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-200">Price drops</p>
                <p className="text-xs text-gray-500">Earn credit</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active orders banner */}
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

      {/* Categories */}
      <div className="px-5 mb-5">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Categories</h2>
        <div className="flex flex-col gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              disabled={!cat.available}
              onClick={() => cat.available && navigate(`/category/${cat.id}`)}
              className={`flex items-center gap-4 bg-gray-900 border rounded-xl px-4 py-3.5 text-left transition-colors ${
                cat.available
                  ? 'border-gray-800 hover:border-gray-700 active:scale-[0.99]'
                  : 'border-gray-800/50 opacity-50 cursor-not-allowed'
              } ${cat.featured ? 'ring-1 ring-indigo-600/40' : ''}`}
            >
              <span className="text-2xl w-10 h-10 flex items-center justify-center bg-gray-800 rounded-xl">
                {cat.icon}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-100">{cat.name}</span>
                  {cat.featured && (
                    <span className="text-xs bg-indigo-600/20 text-indigo-400 px-1.5 py-0.5 rounded font-medium">Featured</span>
                  )}
                  {!cat.available && (
                    <span className="text-xs bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded">Soon</span>
                  )}
                </div>
                {cat.available ? (
                  <p className="text-xs text-gray-500 mt-0.5">
                    <span className="text-indigo-400 font-medium">{cat.buyersActive} buyers</span> active now
                  </p>
                ) : (
                  <p className="text-xs text-gray-600 mt-0.5">Coming soon</p>
                )}
              </div>
              {cat.available && <ChevronRight className="w-4 h-4 text-gray-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-4">
        <PoweredByOmniva />
      </div>
    </div>
  )
}
