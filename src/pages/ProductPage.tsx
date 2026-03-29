import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock, Truck, ChevronDown, ChevronUp, TrendingDown, Zap, Clock, Calendar } from 'lucide-react'
import { OmnivaSymbol, PoweredByOmniva } from '../components/OmnivaLogo'
import { useEffect, useState, useMemo } from 'react'
import { products } from '../data/mockData'
import DemandBar from '../components/DemandBar'
import { useApp } from '../store/appStore'

function useCommitCountdown(windowHours = 4) {
  // Pool window resets every `windowHours` hours — shows time left to join current pool
  const endsAt = useMemo(() => {
    const now = new Date()
    const msInWindow = windowHours * 60 * 60 * 1000
    const elapsed = now.getTime() % msInWindow
    return new Date(now.getTime() + (msInWindow - elapsed))
  }, [windowHours])

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
  const pad = (n: number) => String(n).padStart(2, '0')
  return { display: `${pad(h)}:${pad(m)}:${pad(s)}`, isUrgent: remaining < 1800, remaining }
}

function getDeliveryRange(deliveryDays: number) {
  const earliest = new Date()
  earliest.setDate(earliest.getDate() + deliveryDays)
  const latest = new Date()
  latest.setDate(latest.getDate() + deliveryDays + 1)

  const fmt = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })

  // Skip weekends for "business days" estimate
  const skipWeekends = (d: Date, days: number) => {
    let added = 0
    const result = new Date(d)
    while (added < days) {
      result.setDate(result.getDate() + 1)
      if (result.getDay() !== 0 && result.getDay() !== 6) added++
    }
    return result
  }

  const estDate = skipWeekends(new Date(), deliveryDays)
  return { label: fmt(estDate), date: estDate }
}

export default function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { placeOrder } = useApp()
  const product = products.find(p => p.id === id)

  const [buyerCount, setBuyerCount] = useState(product?.buyerCount ?? 0)
  const [demandPercent, setDemandPercent] = useState(product?.demandPercent ?? 0)
  const [howItWorksOpen, setHowItWorksOpen] = useState(false)
  const [placing, setPlacing] = useState(false)
  const countdown = useCommitCountdown(4)
  const delivery = product ? getDeliveryRange(product.deliveryDays) : null

  useEffect(() => {
    const timer = setInterval(() => {
      if (Math.random() < 0.35) {
        setBuyerCount(n => n + 1)
        setDemandPercent(n => Math.min(n + 1, 99))
      }
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  if (!product) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Product not found</p>
      </div>
    )
  }

  const saving = product.originalPrice - product.currentPrice
  const savingPct = Math.round((saving / product.originalPrice) * 100)

  const handleBuy = () => {
    setPlacing(true)
    setTimeout(() => {
      const orderId = placeOrder(product.id, product.name, product.currentPrice)
      navigate(`/order/${orderId}`)
    }, 600)
  }

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-950/95 backdrop-blur px-5 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-gray-400 hover:text-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
          <OmnivaSymbol size={22} />
        </div>
      </div>

      <div className="px-5 pb-32">
        {/* Product hero */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0">
            {product.icon}
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">{product.brand}</p>
            <h1 className="text-lg font-bold text-gray-100 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-1.5 mt-1.5">
              <Truck className="w-3.5 h-3.5 text-[#FF5E00]" />
              <span className="text-xs text-gray-400">
                Omniva delivery by{' '}
                <span className="font-semibold text-gray-200">{delivery?.label}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {product.specs.map(spec => (
            <span key={spec} className="text-xs bg-gray-800 text-gray-400 px-2.5 py-1 rounded-full">
              {spec}
            </span>
          ))}
        </div>

        {/* Commit window + delivery at a glance */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {/* Pool window countdown */}
          <div className={`bg-gray-900 border rounded-xl px-3 py-3 ${countdown.isUrgent ? 'border-orange-500/40' : 'border-gray-800'}`}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Clock className={`w-3.5 h-3.5 ${countdown.isUrgent ? 'text-orange-400' : 'text-indigo-400'}`} />
              <span className="text-xs text-gray-500">Pool closes in</span>
            </div>
            <p className={`font-mono font-bold text-xl tabular-nums ${countdown.isUrgent ? 'text-orange-400' : 'text-gray-100'}`}>
              {countdown.display}
            </p>
            <p className="text-xs text-gray-600 mt-0.5">to join this window</p>
          </div>

          {/* Delivery date */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl px-3 py-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#FF5E00]" />
              <span className="text-xs text-gray-500">Delivered by</span>
            </div>
            <p className="font-semibold text-gray-100 text-sm leading-tight">{delivery?.label}</p>
            <p className="text-xs text-gray-600 mt-0.5">Omniva {product.deliveryDays}d shipping</p>
          </div>
        </div>

        {/* Price card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4">
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="text-xs text-gray-500 mb-1">Current best price</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-100">€{product.currentPrice}</span>
                {saving > 0 && (
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 line-through">€{product.originalPrice}</span>
                    <span className="flex items-center gap-0.5 text-xs font-semibold text-green-400">
                      <TrendingDown className="w-3 h-3" />
                      -{savingPct}% already
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 bg-indigo-500/10 rounded-full px-2.5 py-1">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs font-semibold text-indigo-400">May drop</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-3 mb-4">
            Buy now at this price. If more buyers join and price drops, you automatically earn credit.
          </p>

          {/* Demand bar */}
          <DemandBar
            percent={demandPercent}
            buyerCount={buyerCount}
            animate
          />

          {/* Live pulse indicator */}
          <div className="flex items-center gap-2 mt-3">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-400 animate-ping opacity-60" />
            </div>
            <span className="text-xs text-gray-500">Live — demand updating</span>
          </div>
        </div>

        {/* Guarantees */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <Lock className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-200">Price locked at €{product.currentPrice}</p>
                <p className="text-xs text-gray-500">You never pay more than this</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingDown className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-200">Earn credit if price improves</p>
                <p className="text-xs text-gray-500">Applied to your next purchase automatically</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Truck className="w-4 h-4 text-[#FF5E00] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-200">Omniva guaranteed delivery</p>
                <p className="text-xs text-gray-500">
                  By <span className="text-gray-300 font-medium">{delivery?.label}</span> · {product.deliveryDays} business day{product.deliveryDays > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How it works (collapsed) */}
        <button
          onClick={() => setHowItWorksOpen(o => !o)}
          className="w-full flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 mb-4 hover:border-gray-700 transition-colors"
        >
          <span className="text-sm font-medium text-gray-300">How SmartBuy works</span>
          {howItWorksOpen
            ? <ChevronUp className="w-4 h-4 text-gray-500" />
            : <ChevronDown className="w-4 h-4 text-gray-500" />
          }
        </button>
        {howItWorksOpen && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-4 mb-4 -mt-3">
            <ol className="flex flex-col gap-4">
              {[
                { n: '1', title: 'Lock the price', body: 'You buy at the current best price. Your purchase is confirmed immediately.' },
                { n: '2', title: 'Omniva pools demand', body: 'Within a 12h window, we aggregate orders across the category and negotiate with suppliers.' },
                { n: '3', title: 'Price improves → you win', body: 'If price drops, the difference is added to your credit balance for the next order. No hassle, automatic.' },
              ].map(step => (
                <li key={step.n} className="flex gap-3">
                  <div className="w-6 h-6 bg-indigo-600/20 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-indigo-400">
                    {step.n}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-200">{step.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Fixed CTA */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[390px] px-5 pb-4 bg-gradient-to-t from-gray-950 via-gray-950/90 to-transparent pt-6">
        {/* Urgency strip */}
        <div className={`flex items-center justify-between mb-2 px-1 ${countdown.isUrgent ? 'opacity-100' : 'opacity-70'}`}>
          <div className="flex items-center gap-1.5">
            <Clock className={`w-3.5 h-3.5 ${countdown.isUrgent ? 'text-orange-400' : 'text-gray-500'}`} />
            <span className={`text-xs font-medium ${countdown.isUrgent ? 'text-orange-400' : 'text-gray-500'}`}>
              {countdown.isUrgent ? 'Pool closing soon — ' : 'Pool open — '}
              <span className="font-mono">{countdown.display}</span> left
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-[#FF5E00]" />
            <span className="text-xs text-gray-500">by <span className="text-gray-300">{delivery?.label}</span></span>
          </div>
        </div>

        <button
          onClick={handleBuy}
          disabled={placing}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-70 text-white font-semibold rounded-2xl py-4 text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {placing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Locking price…
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Lock Price & Buy — €{product.currentPrice}
            </>
          )}
        </button>
        <div className="flex items-center justify-between mt-2 px-1">
          <p className="text-xs text-gray-500">No downside. Only upside.</p>
          <PoweredByOmniva />
        </div>
      </div>
    </div>
  )
}
