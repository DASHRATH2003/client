# Crypto Tracker Frontend (React + Vite + Tailwind)

A simple dashboard that shows the top 10 cryptocurrencies with auto‑refresh, search, and manual actions. Includes a light/dark mode toggle.

## Stack
- React + Vite
- TailwindCSS

## Quick Start
1. `cd frontend && npm install`
2. Start dev server: `npm run dev`
3. Open the app (Vite prints the port, e.g., `http://localhost:3002/`).

## Backend Proxy
- During development, `/api` is proxied to the backend:
```js
// vite.config.js
server: {
  proxy: {
    '/api': { target: 'http://localhost:5000', changeOrigin: true }
  }
}
```
- Make sure the backend is running before using the dashboard buttons.

## Deploy (Vercel + Render)
- Set this env var in Vercel Project Settings → Environment Variables:
  - `VITE_API_BASE=https://server-1-4bfp.onrender.com`
- Re‑deploy the frontend. It will call the Render backend via that URL.
- Local dev remains unchanged (proxy to `http://localhost:5000`).

## Project Structure
- `src/pages/Dashboard.jsx` — dashboard UI (search, refresh, store snapshot, dark mode toggle)
- `src/api/api.js` — API helpers for `/api/coins` and `/api/history`
- `src/App.jsx` — mounts the Dashboard

## Notes
- Auto‑refresh runs every 30 minutes.
- Dark mode uses Tailwind `dark` class (enabled in `tailwind.config.js`).

## Troubleshooting
- No data / network errors: check backend is up and MongoDB is connected; proxy points to port `5000`.
- Styling issues: Tailwind config is present; restart dev server after changes.