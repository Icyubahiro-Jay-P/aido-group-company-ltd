# AIDO Frontend

The frontend for **AIDO Group Company Ltd** — an inventory management system built with React and Vite.

## Tech Stack

- **React 19** with Vite 8
- **Tailwind CSS 4**
- **React Router DOM 7**
- **Axios** for API requests
- **Lucide React** for icons
- **Sonner** for toast notifications
- **jsPDF** + **html2canvas** for PDF generation
- **Vercel Analytics**

## Features

- User authentication (login, forgot/reset password)
- Dashboard with inventory overview
- Products, purchases, and sales management
- Client management
- Reports and receipts (PDF export)
- Stock-in tracking
- Contact form
- Settings

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Lint
npm run lint

# Preview production build
npm run preview
```

The dev server runs at `http://localhost:5173` by default.

## Environment

The frontend connects to the backend API. Configure the API base URL in the axios instance under `src/api/`.

## Project Structure

```
src/
├── api/          # Axios instance & API helpers
├── assets/       # Static assets
├── components/   # Reusable UI components
├── hooks/        # Custom React hooks
├── pages/        # Route pages
└── utils/        # Utility functions
```

## License

[MIT](./LICENSE)
