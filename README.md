# AIDO Group — Frontend

The frontend for **AIDO Group Company Ltd** — an inventory, sales, purchases,
clients and receipts management system for the AIDO Group and AIDO Paper Bags
branches. Built with React and Vite, it is a progressive web app (PWA) that
keeps working **offline** once you have logged in at least once.

## Tech Stack

- **React 19** + **Vite 8**
- **Tailwind CSS 4**
- **React Router DOM 7** (SPA routing)
- **Axios** for API requests (single instance, cookie + branch header)
- **Dexie** (IndexedDB) for the offline cache and pending-write queue
- **vite-plugin-pwa** for service worker + app manifest
- **jsPDF** + **html2canvas** for receipt PDF export
- **Lucide React** icons, **Sonner** toasts, **uuid** for offline mutation ids
- **@vercel/analytics** for traffic analytics

## Features

- Authentication: login, logout, forgot/reset password, profile settings
- Multi-branch dashboard: overview stats, recent sales, low-stock alerts
- **Branch switching** for Boss accounts (AIDO Group / AIDO Paper Bags)
- Products, purchases, sales, stock-in and client management
- Reports: income, expense, profit, loss, clients, low-stock, inventory summary
- Receipts: on-screen print and **PDF download** (includes the issuing staff
  member under "Sold By")
- Settings with user management
- Public landing page and contact form
- **Offline-capable PWA**: cached app shell, branch-scoped data cache, and a
  pending write queue that syncs automatically when back online

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server (default http://localhost:5173)
npm run dev

# Lint
npm run lint

# Build for production
npm run build

# Preview the production build
npm run preview
```

## Environment

The API base URL is read from `VITE_API_URL`. If it is not set, the build
defaults to `https://aido-backend-h6gd.onrender.com`.

```bash
# .env.local (optional)
VITE_API_URL=http://localhost:5000
```

## Project Structure

```
frontend/
├── public/          # Static assets (images, icons, sitemap, verification file)
├── src/
│   ├── api/         # Axios client + API service modules per entity
│   ├── assets/      # Build-time assets
│   ├── components/  # Reusable UI (sidebar, layout, badges, modals, ...)
│   ├── context/     # Branch provider (active branch state)
│   ├── hooks/       # Protected routes, page load helpers
│   ├── offline/     # Dexie cache, sync queue, online/offline status
│   ├── pages/       # Route pages (Dashboard, Sales, Reports, Settings, ...)
│   └── utils/       # Receipt printing/PDF helpers, formatting, etc.
├── index.html
├── vite.config.js   # Vite + Tailwind + PWA plugin config
└── vercel.json      # SPA rewrites for Vercel
```

## Branch Switching

- `context/BranchProvider.jsx` resolves the logged-in user's active branch.
- Every request is stamped with the `X-Active-Branch` header by the axios
  request interceptor in `api/axiosClient.js`.
- The chosen branch is persisted per user in `localStorage`, and the header
  pill in the header bar lets Bosses switch branches (reloads the app).
- Only accounts with `canSwitchBranches: true` are allowed to switch; other
  users are pinned to their home branch by the backend.

## Offline Architecture

The app is a PWA: the service worker precaches the built app shell so navigation
works with no network, and Dexie mirrors business data locally.

```
src/offline/
├── db.js             # Dexie schema (products/sales/purchases/clients + queue + syncLog)
├── sync.js           # Replays the pending write queue in order on reconnect
├── onlineStatus.js   # Global online/offline flag (fast initial detection)
└── useOnlineStatus.js# Hook to react to connectivity changes
```

- **Cache**: API responses are mirrored into IndexedDB tables, scoped by
  branch, and read as a fallback when the network is unavailable.
- **Write queue**: sales/purchases/products/clients created offline are queued
  with a `clientMutationId` (UUID). On reconnect, `sync.js` replays the queue
  in order, remaps temporary ids to server ids, and drops permanently-rejected
  ops. The backend deduplicates by `clientMutationId` so a replay can never
  double-book.
- **Health**: the app pings the backend health endpoint; a short axios timeout
  (10 s) makes offline failures surface quickly.

### Offline note

The service worker installs on the first visit after a deploy; **full offline
use works from the second visit onward**. The external Inter font falls back to
a system font offline.

## Deployment (Vercel)

1. Push the `frontend/` folder to Vercel (framework preset: Vite).
2. Set `VITE_API_URL` to your backend URL in the Vercel project environment.
3. `vercel.json` rewrites every route to `index.html` for SPA support and
   preserves the Google site-verification file.

## License

[MIT](./LICENSE) © 2026 Icyubahiro Jay P
