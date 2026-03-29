import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { products, categories } from '../data/mockData'
import ProductCard from '../components/ProductCard'

export default function CategoryPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const category = categories.find(c => c.id === id)
  const categoryProducts = products.filter(p => p.categoryId === id)

  const [activeBuyers, setActiveBuyers] = useState(category?.buyersActive ?? 0)
  const [pulse, setPulse] = useState(false)

  // Simulate live buyer count ticking up
  useEffect(() => {
    const id = setInterval(() => {
      const delta = Math.random() < 0.4 ? 1 : 0
      if (delta) {
        setActiveBuyers(n => n + delta)
        setPulse(true)
        setTimeout(() => setPulse(false), 600)
      }
    }, 3000)
    return () => clearInterval(id)
  }, [])

  if (!category) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Category not found</p>
      </div>
    )
  }

  const sortedProducts = [...categoryProducts].sort((a, b) => b.demandPercent - a.demandPercent)

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-950/95 backdrop-blur px-5 pt-12 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-gray-400 hover:text-gray-100 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-100">{category.name}</h1>
            <p className="text-sm text-gray-400 mt-0.5">Best deals, pooled by demand</p>
          </div>
          <div className={`flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1.5 transition-all ${pulse ? 'scale-105' : ''}`}>
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-indigo-400" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-indigo-400 animate-ping opacity-75" />
            </div>
            <span className="text-sm font-semibold text-indigo-400 tabular-nums">{activeBuyers}</span>
            <Users className="w-3.5 h-3.5 text-indigo-500" />
          </div>
        </div>

        {/* Insight strip */}
        <div className="mt-3 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2">
          <p className="text-xs text-gray-400">
            <span className="text-indigo-400 font-medium">{activeBuyers} buyers active</span> — more demand means better prices.{' '}
            <span className="text-gray-500">Lock any price to join the pool.</span>
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="px-5 pt-2 pb-4 flex flex-col gap-3">
        {sortedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
