import { useRef, useState, useEffect } from 'react'
import { Search, X, TrendingDown, Flame } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { products, type Product } from '../data/mockData'

function highlight(text: string, query: string) {
  if (!query) return <>{text}</>
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-indigo-500/30 text-indigo-300 rounded-sm">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}

function match(p: Product, q: string): boolean {
  const s = q.toLowerCase()
  return (
    p.name.toLowerCase().includes(s) ||
    p.brand.toLowerCase().includes(s) ||
    p.category.toLowerCase().includes(s) ||
    p.specs.some(spec => spec.toLowerCase().includes(s))
  )
}

const POPULAR = ['iPhone', 'AirPods', 'Samsung', 'PlayStation', 'Dyson']

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const results = query.trim().length > 0
    ? products.filter(p => match(p, query.trim())).slice(0, 6)
    : []

  const showDropdown = open && (results.length > 0 || query.trim().length === 0)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function selectProduct(id: string) {
    setOpen(false)
    setQuery('')
    navigate(`/product/${id}`)
  }

  function applyPopular(term: string) {
    setQuery(term)
    inputRef.current?.focus()
  }

  return (
    <div ref={containerRef} className="relative px-5 mb-5">
      {/* Input */}
      <div className={`flex items-center gap-2.5 bg-gray-900 border rounded-xl px-3.5 py-3 transition-colors ${
        open ? 'border-indigo-500/60 ring-1 ring-indigo-500/20' : 'border-gray-800'
      }`}>
        <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder="Search products, brands…"
          className="flex-1 bg-transparent text-sm text-gray-100 placeholder-gray-600 outline-none"
          onFocus={() => setOpen(true)}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onKeyDown={e => {
            if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur() }
            if (e.key === 'Enter' && results.length > 0) selectProduct(results[0].id)
          }}
        />
        {query.length > 0 && (
          <button onClick={() => { setQuery(''); inputRef.current?.focus() }} className="text-gray-600 hover:text-gray-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute left-5 right-5 top-full mt-1.5 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden">

          {/* Popular searches (shown when no query) */}
          {query.trim().length === 0 && (
            <div className="p-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-1 mb-2">Popular searches</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR.map(term => (
                  <button
                    key={term}
                    onMouseDown={() => applyPopular(term)}
                    className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-1.5 rounded-full transition-colors"
                  >
                    <Flame className="w-3 h-3 text-orange-400" />
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <ul className="divide-y divide-gray-800/50">
              {results.map(product => {
                const saving = product.originalPrice - product.currentPrice
                const savingPct = Math.round((saving / product.originalPrice) * 100)
                return (
                  <li key={product.id}>
                    <button
                      onMouseDown={() => selectProduct(product.id)}
                      className="w-full flex items-center gap-3 px-3.5 py-3 hover:bg-gray-800/60 transition-colors text-left"
                    >
                      <div className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                        {product.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-100 truncate">
                          {highlight(product.name, query)}
                        </p>
                        <p className="text-xs text-gray-500">{product.brand} · {product.category}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-gray-100">€{product.currentPrice}</p>
                        {saving > 0 && (
                          <div className="flex items-center gap-0.5 justify-end">
                            <TrendingDown className="w-3 h-3 text-green-400" />
                            <span className="text-xs text-green-400 font-semibold">-{savingPct}%</span>
                          </div>
                        )}
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}

          {/* No results */}
          {query.trim().length > 0 && results.length === 0 && (
            <div className="px-4 py-8 text-center">
              <Search className="w-6 h-6 text-gray-700 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No products found for "{query}"</p>
              <p className="text-xs text-gray-600 mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
