interface OmnivaSymbolProps {
  size?: number
  className?: string
}

/** Omniva symbol: 4 rounded pill shapes rotated 90° each, forming a square gap in the center */
export function OmnivaSymbol({ size = 32, className = '' }: OmnivaSymbolProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {[0, 90, 180, 270].map(angle => (
        <rect
          key={angle}
          x="30"
          y="24"
          width="46"
          height="18"
          rx="9"
          fill="#FF5E00"
          transform={`rotate(${angle}, 50, 50)`}
        />
      ))}
    </svg>
  )
}

interface OmnivaLogoProps {
  /** Show just the symbol, or symbol + wordmark */
  variant?: 'symbol' | 'full'
  symbolSize?: number
  className?: string
}

/** Inline "Powered by Omniva logistics" trust badge */
export function PoweredByOmniva({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-1.5 ${className}`}>
      <OmnivaSymbol size={14} />
      <span className="text-xs text-gray-500">
        Powered by{' '}
        <span className="font-semibold" style={{ color: '#FF5E00' }}>Omniva</span>
        {' '}logistics
      </span>
    </div>
  )
}

/** Full Omniva SmartBuy lockup: symbol + "omniva" wordmark + "SmartBuy" sub-brand */
export default function OmnivaLogo({ variant = 'full', symbolSize = 36, className = '' }: OmnivaLogoProps) {
  if (variant === 'symbol') {
    return <OmnivaSymbol size={symbolSize} className={className} />
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <OmnivaSymbol size={symbolSize} />
      <div className="flex flex-col leading-none">
        <span
          className="font-bold text-white tracking-tight"
          style={{ fontSize: symbolSize * 0.5, letterSpacing: '-0.02em' }}
        >
          omniva
        </span>
        <span
          className="font-semibold tracking-wide uppercase"
          style={{ fontSize: symbolSize * 0.3, color: '#FF5E00', letterSpacing: '0.08em' }}
        >
          SmartBuy
        </span>
      </div>
    </div>
  )
}
