import { useParams, useNavigate } from 'react-router-dom'
import { Trophy, Wallet, ArrowRight } from 'lucide-react'
import { useApp } from '../store/appStore'
import WinAnimation from '../components/WinAnimation'
import { OmnivaSymbol } from '../components/OmnivaLogo'
import TrackingCard from '../components/TrackingCard'

export default function WinMomentPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { orders, creditBalance } = useApp()
  const order = orders.find(o => o.id === id)

  if (!order || order.status !== 'won' || !order.finalPrice) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-gray-400">No win result found.</p>
        <button onClick={() => navigate('/')} className="text-indigo-400 text-sm">Go home</button>
      </div>
    )
  }

  const credit = order.creditEarned
  const savingPct = ((order.lockedPrice - order.finalPrice) / order.lockedPrice * 100).toFixed(1)

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start pt-16 px-5 pb-10 overflow-hidden">
      <WinAnimation />

      {/* Brand mark */}
      <div className="relative z-10 mb-4">
        <OmnivaSymbol size={28} />
      </div>

      {/* Trophy icon */}
      <div className="relative z-10 w-20 h-20 bg-yellow-500/15 border-2 border-yellow-500/40 rounded-full flex items-center justify-center mb-5">
        <Trophy className="w-9 h-9 text-yellow-400" />
      </div>

      {/* Title */}
      <div className="relative z-10 text-center mb-8">
        <p className="text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-1">SmartBuy win</p>
        <h1 className="text-3xl font-bold text-gray-100">Price improved!</h1>
        <p className="text-gray-400 mt-1.5">{order.productName}</p>
      </div>

      {/* Price comparison */}
      <div className="relative z-10 w-full bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4">
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Locked price</p>
            <p className="text-xl font-bold text-gray-500 line-through">€{order.lockedPrice}</p>
          </div>
          <div className="flex flex-col items-center">
            <ArrowRight className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Final price</p>
            <p className="text-xl font-bold text-gray-100">€{order.finalPrice.toFixed(2)}</p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-500">
            Price dropped by <span className="text-green-400 font-semibold">{savingPct}%</span> after more buyers joined
          </p>
        </div>
      </div>

      {/* Credit reveal — the big moment */}
      <div className="relative z-10 w-full animate-credit-reveal mb-4">
        <div className="bg-green-500/10 border-2 border-green-500/30 rounded-2xl p-5 text-center">
          <p className="text-sm font-semibold text-green-500/80 mb-2">Credit added to your account</p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-5xl font-bold text-green-400">+€{credit.toFixed(2)}</span>
          </div>
          <p className="text-xs text-green-600 mt-2">Use on your next SmartBuy purchase</p>
        </div>
      </div>

      {/* Why */}
      <div className="relative z-10 w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 mb-6 animate-slide-up">
        <p className="text-xs text-gray-500 text-center">
          More buyers joined the pool → Omniva negotiated a better deal → you got the difference as credit
        </p>
      </div>

      {/* Credit balance */}
      <div className="relative z-10 w-full bg-gray-900 border border-gray-800 rounded-xl p-4 mb-5 animate-slide-up-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-gray-400">Total credit balance</span>
          </div>
          <span className="text-lg font-bold text-indigo-400">€{creditBalance.toFixed(2)}</span>
        </div>
      </div>

      {/* Delivery tracking */}
      {order.tracking && order.parcelCode && order.estimatedDelivery && (
        <div className="relative z-10 w-full mb-5 animate-slide-up-2">
          <TrackingCard
            parcelCode={order.parcelCode}
            estimatedDelivery={order.estimatedDelivery}
            steps={order.tracking}
          />
        </div>
      )}

      {/* CTA */}
      <div className="relative z-10 w-full flex flex-col gap-3">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-2xl py-4 text-base transition-colors"
        >
          Awesome! View my credits
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-2xl py-3 text-sm transition-colors"
        >
          Shop again
        </button>
      </div>
    </div>
  )
}
