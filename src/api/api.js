export async function getCoins() {
  const res = await fetch('/api/coins');
  if (!res.ok) throw new Error('Failed to fetch coins');
  return res.json();
}

export async function postHistory() {
  const res = await fetch('/api/history', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to store history');
  return res.json();
}

export async function getHistory(coinId) {
  const res = await fetch(`/api/history/${coinId}`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}