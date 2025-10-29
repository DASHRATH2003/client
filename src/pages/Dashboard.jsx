import React, { useEffect, useMemo, useState } from 'react'
import { getCoins, postHistory } from '../api/api'

function formatUSD(n) {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n)
  } catch {
    return `$${Number(n).toFixed(2)}`
  }
}

function formatMarketCap(n) {
  if (n >= 1e12) {
    return `$${(n / 1e12).toFixed(2)}T`
  } else if (n >= 1e9) {
    return `$${(n / 1e9).toFixed(2)}B`
  } else if (n >= 1e6) {
    return `$${(n / 1e6).toFixed(2)}M`
  }
  return formatUSD(n)
}

const Dashboard = () => {
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [lastFetchedAt, setLastFetchedAt] = useState(null)
  const [theme, setTheme] = useState('light')

  async function loadCoins() {
    setLoading(true)
    setError('')
    try {
      const data = await getCoins()
      setCoins(data)
      setLastFetchedAt(new Date())
    } catch (e) {
      setError(e.message || 'Failed to load coins')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Theme init from localStorage
    const saved = localStorage.getItem('theme')
    const initial = saved === 'dark' ? 'dark' : 'light'
    setTheme(initial)
    if (initial === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    // Initial data load + auto refresh every 30 min
    loadCoins()
    const interval = setInterval(loadCoins, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return coins
    return coins.filter(c => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q))
  }, [coins, query])

  async function snapshotHistory() {
    try {
      await postHistory()
      alert('History snapshot stored!')
    } catch (e) {
      alert('Failed to store history: ' + (e.message || 'unknown error'))
    }
  }

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('theme', next)
    if (next === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 dark:from-gray-900 dark:to-gray-800 dark:text-gray-100 transition-colors duration-300">
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 9.409A2.25 2.25 0 013 7.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 6z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">Crypto Dashboard</h1>
          </div>
          <button
            onClick={toggleTheme}
            className="rounded-xl bg-white/10 hover:bg-white/20 px-4 py-3 text-sm font-medium flex items-center gap-2 transition-all duration-300 hover:scale-105"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <>
                <span>🌙</span>
                <span>Dark Mode</span>
              </>
            ) : (
              <>
                <span>☀️</span>
                <span>Light Mode</span>
              </>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="relative flex-1 min-w-[300px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by name or symbol..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={loadCoins}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 font-medium flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Data
            </button>
            
            <button
              onClick={snapshotHistory}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 font-medium flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Store Snapshot
            </button>
          </div>
          
          {lastFetchedAt && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 rounded-lg px-3 py-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Last updated: {lastFetchedAt.toLocaleString()}
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {loading && (
          <div className="mb-6 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-center">
            <div className="flex justify-center items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              <span className="text-lg font-medium">Loading cryptocurrency data...</span>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 text-left border-b-2 border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Coin Name</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Symbol</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Current Price</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Market Cap</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">24h Change</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filtered.map((c) => (
                  <tr 
                    key={c.coinId} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {c.symbol.charAt(0)}
                        </div>
                        <span className="font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {c.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                        {c.symbol}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {formatUSD(c.priceUsd)}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {formatMarketCap(c.marketCapUsd)}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                        c.change24hPercent >= 0 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {c.change24hPercent >= 0 ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        )}
                        {(c.change24hPercent ?? 0).toFixed(2)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
                      {new Date(c.lastUpdated).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filtered.length === 0 && !loading && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No cryptocurrencies found</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Try adjusting your search query</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard