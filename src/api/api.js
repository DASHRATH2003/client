const API_BASE = import.meta.env.VITE_API_BASE || '/api'

export async function getCoins() {
  const res = await fetch(`${API_BASE}/coins`)
  if (!res.ok) throw new Error('Failed to fetch coins')
  return res.json()
}

export async function postHistory() {
  const res = await fetch(`${API_BASE}/history`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed to store history')
  return res.json()
}

export async function getHistory(coinId) {
  const res = await fetch(`${API_BASE}/history/${coinId}`)
  if (!res.ok) throw new Error('Failed to fetch history')
  return res.json()
}