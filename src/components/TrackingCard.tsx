import { Package, CheckCircle2, Circle, MapPin, ExternalLink } from 'lucide-react'
import type { TrackingStep } from '../data/mockData'

interface TrackingCardProps {
  parcelCode: string
  estimatedDelivery: Date
  steps: TrackingStep[]
}

function formatTime(d: Date) {
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(d: Date) {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  if (d.toDateString() === today.toDateString()) return `Today, ${formatTime(d)}`
  if (d.toDateString() === tomorrow.toDateString()) return `Tomorrow, ${formatTime(d)}`
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

export default function TrackingCard({ parcelCode, estimatedDelivery, steps }: TrackingCardProps) {
  const currentStep = steps.findIndex(s => !s.done)
  const activeStep = currentStep === -1 ? steps.length - 1 : currentStep

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-[#FF5E00]" />
          <span className="text-sm font-semibold text-gray-100">Omniva Tracking</span>
        </div>
        <button
          className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          onClick={() => window.open(`https://www.omniva.ee/private/parcel?parcel_code=${parcelCode}`, '_blank')}
        >
          {parcelCode}
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* ETA banner */}
      <div className="px-4 py-3 bg-[#FF5E00]/10 border-b border-[#FF5E00]/20 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Estimated delivery</p>
          <p className="text-sm font-semibold text-gray-100">{formatDate(estimatedDelivery)}</p>
        </div>
        <div className="flex items-center gap-1.5 bg-[#FF5E00]/20 border border-[#FF5E00]/30 rounded-full px-2.5 py-1">
          <div className="w-2 h-2 rounded-full bg-[#FF5E00] animate-pulse" />
          <span className="text-xs font-semibold text-[#FF5E00]">On its way</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-4 py-4">
        <div className="flex flex-col">
          {steps.map((step, i) => {
            const isActive = i === activeStep
            const isDone = step.done
            const isLast = i === steps.length - 1

            return (
              <div key={step.status} className="flex gap-3">
                {/* Icon + line */}
                <div className="flex flex-col items-center">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isDone
                      ? 'bg-[#FF5E00]'
                      : isActive
                      ? 'bg-gray-800 border-2 border-[#FF5E00]'
                      : 'bg-gray-800 border border-gray-700'
                  }`}>
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                    ) : isActive ? (
                      <div className="w-2 h-2 rounded-full bg-[#FF5E00] animate-pulse" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-gray-700" />
                    )}
                  </div>
                  {!isLast && (
                    <div className={`w-px flex-1 mt-1 mb-1 min-h-[20px] ${
                      isDone ? 'bg-[#FF5E00]/50' : 'bg-gray-800'
                    }`} />
                  )}
                </div>

                {/* Content */}
                <div className={`pb-4 flex-1 ${isLast ? 'pb-0' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`text-sm font-semibold leading-tight ${
                        isDone
                          ? 'text-gray-100'
                          : isActive
                          ? 'text-[#FF5E00]'
                          : 'text-gray-600'
                      }`}>
                        {step.label}
                      </p>
                      <p className={`text-xs mt-0.5 ${
                        isDone || isActive ? 'text-gray-500' : 'text-gray-700'
                      }`}>
                        {step.detail}
                      </p>
                    </div>
                    {step.timestamp && (
                      <span className="text-xs text-gray-600 flex-shrink-0 mt-0.5">
                        {formatTime(step.timestamp)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Parcel locker footer */}
      <div className="px-4 py-3 border-t border-gray-800 flex items-center gap-2">
        <MapPin className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
        <p className="text-xs text-gray-500">
          Delivering to your nearest <span className="text-gray-400">Omniva parcel locker</span>
        </p>
      </div>
    </div>
  )
}
