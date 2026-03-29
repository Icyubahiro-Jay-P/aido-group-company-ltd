import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, LayersPlus, BanknoteArrowUp, ReceiptText, Settings, ChevronRight } from 'lucide-react'

const NotFound = () => {
  const navigate = useNavigate()

  useEffect(() => {
    document.title = "404 - Page Not Found - AIDO Group Company Ltd"
  }, [])

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Main Content Only */}
      <main className="flex-1 overflow-auto p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full text-center">
          
          {/* 404 Message */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-100 mb-6">
              <h1 className="text-5xl font-black text-red-600">!</h1>
            </div>
            
            <h2 className="text-4xl font-bold text-slate-900 mb-3">
              404
            </h2>
            
            <p className="text-xl text-slate-600 mb-2 font-semibold">
              Page Not Found
            </p>
            
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Sorry, the page you're looking for doesn't exist or has been moved. Let's get you back on track.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <button
              onClick={() => navigate('/dashboard')}
              className="group flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              <LayoutDashboard size={20} />
              Go to Dashboard
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors font-semibold"
            >
              Go Back
            </button>
          </div>

          {/* Quick Navigation Grid */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Quick Navigation
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg transition-all text-slate-700 hover:text-blue-600 flex flex-col items-center gap-2"
              >
                <LayoutDashboard size={24} />
                <span className="text-xs font-medium">Dashboard</span>
              </button>
              <button
                onClick={() => navigate('/inventory')}
                className="p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg transition-all text-slate-700 hover:text-blue-600 flex flex-col items-center gap-2"
              >
                <Package size={24} />
                <span className="text-xs font-medium">Inventory</span>
              </button>
              <button
                onClick={() => navigate('/receipts')}
                className="p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg transition-all text-slate-700 hover:text-blue-600 flex flex-col items-center gap-2"
              >
                <ReceiptText size={24} />
                <span className="text-xs font-medium">Receipts</span>
              </button>
              <button
                onClick={() => navigate('/sales')}
                className="p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg transition-all text-slate-700 hover:text-blue-600 flex flex-col items-center gap-2"
              >
                <BanknoteArrowUp size={24} />
                <span className="text-xs font-medium">Sales</span>
              </button>
              <button
                onClick={() => navigate('/stock-in')}
                className="p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg transition-all text-slate-700 hover:text-blue-600 flex flex-col items-center gap-2"
              >
                <LayersPlus size={24} />
                <span className="text-xs font-medium">Stock In</span>
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg transition-all text-slate-700 hover:text-blue-600 flex flex-col items-center gap-2"
              >
                <Settings size={24} />
                <span className="text-xs font-medium">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default NotFound