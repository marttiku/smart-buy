import { useParams, useNavigate } from 'react-router-dom'
import { Check, Home, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useApp } from '../store/appStore'
import DemandBar from '../components/DemandBar'
import CountdownTimer from '../components/CountdownTimer'

export default function OrderLockedPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { orders, triggerWin } = useApp()
  const order = orders.find(o => o.id === id)

  const [buyerCount, setBuyerCount] = useState(order?.buyerCount ?? 1)
  const [demandPercent, setDemandPercent] = useState(12)
  const [newJoined, setNewJoined] = useState(0)
  const [showJoinFlash, setShowJoinFlash] = useState(false)

  // Simulate buyers joining over time
  useEffect(() => {
    const timer = setInterval(() => {
      if (Math.random() < 0.6) {
        const delta = Math.floor(Math.random() * 3) + 1
        setBuyerCount(n => n + delta)
        setDemandPercent(n => Math.min(n + delta * 2, 95))
        setNewJoined(delta)
        setShowJoinFlash(true)
        setTimeout(() => setShowJoinFlash(false), 2000)
      }
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  if (!order) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Order not found</p>
      </div>
    )
  }

  const handleSimulateWin = () => {
    const newPrice = parseFloat((order.lockedPrice * 0.985).toFixed(2))
    triggerWin(order.id, newPrice)
    navigate(`/order/${order.id}/win`)
  }

  return (
    <div className="px-5 pt-14 flex flex-col gap-5">
      {/* Success header */}
      <div className="flex flex-col items-center text-center pt-4 pb-2">
        <div className="w-16 h-16 bg-green-500/15 border-2 border-green-500/30 rounded-full flex items-center justify-center mb-4">
          <Check className="w-8 h-8 text-green-400 stroke-[2.5]" />
        </div>
        <h1 className="text-2xl font-bold text-gray-100">Price Locked!</h1>
        <p className="text-sm text-gray-400 mt-1">{order.productName}</p>
        <div className="mt-3 bg-gray-900 border border-gray-800 rounded-xl px-5 py-3">
          <p className="text-xs text-gray-500 mb-0.5">Your locked price</p>
          <p className="text-3xl font-bold text-gray-100">€{order.lockedPrice}</p>
          <p className="text-xs text-indigo-400 mt-0.5">You will never pay more than this</p>
        </div>
      </div>

      {/* Countdown */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-200">Price window closes in</p>
          <CountdownTimer endsAt={order.windowEndsAt} />
        </div>
        <p className="text-xs text-gray-500">
          Omniva is pooling demand in your category. If the price improves, you earn credit automatically.
        </p>
      </div>

      {/* Live demand */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-200">Demand pool</p>
          <div className="flex items-center gap-1.5">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-indigo-400" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-indigo-400 animate-ping opacity-60" />
            </div>
            <span className="text-xs text-indigo-400 font-medium">Live</span>
          </div>
        </div>

        <DemandBar
          percent={demandPercent}
          buyerCount={buyerCount}
          animate
        />

        {/* Flash when someone joins */}
        <div className={`mt-3 transition-all duration-300 ${showJoinFlash ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-3 py-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
            <p className="text-xs text-indigo-300">
              +{newJoined} {newJoined === 1 ? 'buyer' : 'buyers'} just joined the pool
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          More buyers in your pool → more negotiating power → better chance of price improvement.
        </p>
      </div>

      {/* What happens next */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">What happens next</p>
        <div className="flex flex-col gap-3">
          {[
            { icon: '⏱️', text: 'Price window runs for up to 12h' },
            { icon: '📦', text: 'Omniva negotiates with suppliers using pooled demand' },
            { icon: '✨', text: 'If price drops, credit is added to your account' },
            { icon: '🚚', text: 'Your order is delivered by Omniva regardless' },
          ].map(item => (
            <div key={item.text} className="flex items-start gap-3">
              <span className="text-base">{item.icon}</span>
              <p className="text-sm text-gray-400">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Demo trigger */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
        <p className="text-xs text-gray-500 mb-3 text-center">— Prototype demo —</p>
        <button
          onClick={handleSimulateWin}
          className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl py-3 text-sm transition-colors flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Simulate: Price dropped!
        </button>
        <p className="text-xs text-gray-600 text-center mt-2">Tap to see the win moment</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pb-4">
        <button
          onClick={() => navigate('/')}
          className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-100 font-medium rounded-xl py-3 text-sm transition-colors"
        >
          <Home className="w-4 h-4" />
          Home
        </button>
        <button
          onClick={() => navigate('/category/electronics')}
          className="flex-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 font-medium rounded-xl py-3 text-sm transition-colors border border-indigo-600/30"
        >
          Browse more
        </button>
      </div>
    </div>
  )
}
