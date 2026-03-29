import { ChevronRight, TrendingDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Product } from '../data/mockData'
import DemandBar from './DemandBar'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate()
  const saving = product.originalPrice - product.currentPrice
  const savingPct = Math.round((saving / product.originalPrice) * 100)

  return (
    <button
      onClick={() => navigate(`/product/${product.id}`)}
      className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-left hover:border-gray-700 transition-colors active:scale-[0.99]"
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
          {product.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs text-gray-500">{product.brand}</p>
              <p className="text-sm font-semibold text-gray-100 leading-tight">{product.name}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0 mt-1" />
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-bold text-gray-100">€{product.currentPrice}</span>
            {saving > 0 && (
              <>
                <span className="text-sm text-gray-500 line-through">€{product.originalPrice}</span>
                <span className="flex items-center gap-0.5 text-xs font-semibold text-green-400 bg-green-500/10 rounded px-1.5 py-0.5">
                  <TrendingDown className="w-3 h-3" />
                  -{savingPct}%
                </span>
              </>
            )}
          </div>

          <DemandBar
            percent={product.demandPercent}
            buyerCount={product.buyerCount}
            className="mt-2.5"
          />

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-indigo-400 font-medium">Price may drop further</span>
            <span className="text-xs text-gray-500">+{product.demandPercent >= 80 ? '🔥' : product.demandPercent >= 50 ? '📈' : '📊'}</span>
          </div>
        </div>
      </div>
    </button>
  )
}
