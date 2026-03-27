import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-red-100">
          <AlertTriangle size={56} className="text-red-600" />
        </div>
        
        <h1 className="text-7xl font-bold text-slate-900 mb-4">404</h1>
        
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">
          Page Not Found
        </h2>
        
        <p className="text-slate-500 mb-8">
          Sorry, the page you're looking for doesn't exist or has been moved. Please check the URL and try again.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
