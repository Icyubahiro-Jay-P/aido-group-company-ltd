import React, { useState, useEffect } from 'react';
import { Menu, Box, DollarSign, ShoppingCart, AlertTriangle,LayoutDashboard, Package, LayersPlus,BanknoteArrowUp,ReceiptText,TrendingUp,Settings,LogOut, TrendingDown, User } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import NavbarItem from '../components/NavbarItem';
import { 
  getDailyIncome, getWeeklyIncome, getMonthlyIncome, getAnnualIncome,
  getDailyExpense, getWeeklyExpense, getMonthlyExpense, getAnnualExpense,
  getDailyProfit, getWeeklyProfit, getMonthlyProfit, getAnnualProfit,
  getDailyLoss, getWeeklyLoss, getMonthlyLoss, getAnnualLoss,
  getDailyClients, getWeeklyClients,
  getInventorySummary, getLowStockItems, getRecentTransactions
} from '../api/reportServices';
import { toast } from 'sonner';
import Loading from '../components/Loading';

const Reports = () => {
  const { user } = useOutletContext();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState('daily'); // daily, weekly, monthly, annual

  // Core metrics
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [profit, setProfit] = useState(0);
  const [loss, setLoss] = useState(0);
  const [clients, setClients] = useState(0);

  // Details
  const [lowStockItems, setLowStockItems] = useState([]);
  const [inventorySummary, setInventorySummary] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const formatCurrency = (amount) => {
    return (amount || 0).toLocaleString('en-US');
  };

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Fetch data based on selected time period
      let incomeData = 0;
      let expenseData = 0;
      let profitData = 0;
      let lossData = 0;
      let clientData = 0;

      if (timePeriod === 'daily') {
        const [incRes, expRes, profRes, lossRes, clientRes] = await Promise.all([
          getDailyIncome(),
          getDailyExpense(),
          getDailyProfit(),
          getDailyLoss(),
          getDailyClients()
        ]);
        incomeData = incRes?.data || 0;
        expenseData = expRes?.data || 0;
        profitData = profRes?.data || 0;
        lossData = lossRes?.data || 0;
        clientData = clientRes?.data || 0;
      } else if (timePeriod === 'weekly') {
        const [incRes, expRes, profRes, lossRes, clientRes] = await Promise.all([
          getWeeklyIncome(),
          getWeeklyExpense(),
          getWeeklyProfit(),
          getWeeklyLoss(),
          getWeeklyClients()
        ]);
        incomeData = incRes?.data || 0;
        expenseData = expRes?.data || 0;
        profitData = profRes?.data || 0;
        lossData = lossRes?.data || 0;
        clientData = clientRes?.data || 0;
      } else if (timePeriod === 'monthly') {
        const [incRes, expRes, profRes, lossRes, clientRes] = await Promise.all([
          getMonthlyIncome(),
          getMonthlyExpense(),
          getMonthlyProfit(),
          getMonthlyLoss(),
          getWeeklyClients()
        ]);
        incomeData = incRes?.data || 0;
        expenseData = expRes?.data || 0;
        profitData = profRes?.data || 0;
        lossData = lossRes?.data || 0;
        clientData = clientRes?.data || 0;
      } else if (timePeriod === 'annual') {
        const [incRes, expRes, profRes, lossRes, clientRes] = await Promise.all([
          getAnnualIncome(),
          getAnnualExpense(),
          getAnnualProfit(),
          getAnnualLoss(),
          getDailyClients()
        ]);
        incomeData = incRes?.data || 0;
        expenseData = expRes?.data || 0;
        profitData = profRes?.data || 0;
        lossData = lossRes?.data || 0;
        clientData = clientRes?.data || 0;
      }

      setIncome(incomeData);
      setExpense(expenseData);
      setProfit(profitData);
      setLoss(lossData);
      setClients(clientData);

      // Fetch static data (not time-dependent)
      const [lowRes, invRes, transRes] = await Promise.all([
        getLowStockItems(10),
        getInventorySummary(),
        getRecentTransactions()
      ]);

      // Process low stock - handle both direct array and wrapped response
      if (Array.isArray(lowRes)) {
        setLowStockItems(lowRes);
      } else if (lowRes?.data && Array.isArray(lowRes.data)) {
        setLowStockItems(lowRes.data);
      } else {
        setLowStockItems([]);
      }

      // Process inventory - getInventorySummary returns data directly
      if (invRes && typeof invRes === 'object') {
        setInventorySummary(invRes?.data || invRes);
      }

      // Process recent transactions
      if (transRes?.data && Array.isArray(transRes.data)) {
        setRecentTransactions(transRes.data.slice(0, 8));
      } else if (Array.isArray(transRes)) {
        setRecentTransactions(transRes.slice(0, 8));
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load reports. Please try again.');
      console.error('Report fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "AIDO Group Company Ltd - Reports";
    fetchReportData();
  }, [timePeriod]);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {navbarOpen && (
        <div 
          className="fixed inset-0 bg-white z-20 lg:hidden"
          onClick={() => setNavbarOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200
        transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${navbarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        <div className="flex items-center justify-center h-16 border-b border-slate-200">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Box size={20} />
            </div>
            Dashboard
          </div>
        </div>

        <nav className="p-4 space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4 mt-4">
            Main
          </div>
          <NavbarItem icon={LayoutDashboard} label="Dashboard" />
          <NavbarItem icon={Package} label="Inventory" />
          {user.role === "Boss" && <NavbarItem icon={LayersPlus} label="Stock in" />}
          
          <NavbarItem icon={BanknoteArrowUp} label="Sales" />
          
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4 mt-6">
            System
          </div>
          <NavbarItem icon={ReceiptText} label="Reciepts" />
          {user.role === "Boss" && <NavbarItem icon={TrendingUp} label="Reports" active />}
          <NavbarItem icon={Settings} label="Settings" />
          <NavbarItem icon={LogOut} label="Logout" isLogout={true} />
        </nav>
        
        {/* User Info at Bottom */}
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
              {user.fullName ? user.fullName.split(' ').map(n => n[0]).join('') : 'JD'}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">
                {user.fullName}
              </p>
              <p className="text-xs text-slate-500">
                {user.role}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setNavbarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-semibold text-slate-900">Reports</h2>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50">
          <div className="mb-8 bg-linear-to-r from-indigo-600 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">Business Analytics</h1>
                <p className="text-indigo-100">Complete overview of your business performance and metrics.</p>
              </div>
              <div className="text-indigo-200">
                <TrendingUp size={48} />
              </div>
            </div>
            <div className="mt-6 flex gap-2 flex-wrap">
              {['daily', 'weekly', 'monthly', 'annual'].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimePeriod(period)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                    timePeriod === period
                      ? 'bg-white text-indigo-600 shadow-lg'
                      : 'bg-white/20 backdrop-blur text-white border border-white/30 hover:bg-white/30'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-96">
              <Loading />
            </div>
          ) : (
            <>
              {/* Main KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Revenue */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-green-100">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-slate-500 text-sm font-medium">Total Revenue</h3>
                  <p className="text-2xl font-bold text-slate-900">{formatCurrency(income)} Frw</p>
                </div>

                {/* Expenses */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-red-100">
                      <TrendingDown className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <h3 className="text-slate-500 text-sm font-medium">Total Expenses</h3>
                  <p className="text-2xl font-bold text-slate-900">{formatCurrency(expense)} Frw</p>
                </div>

                {/* Profit */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-blue-100">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-slate-500 text-sm font-medium">Total Profit</h3>
                  <p className="text-2xl font-bold text-slate-900">{formatCurrency(profit)} Frw</p>
                </div>

                {/* Clients */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-purple-100">
                      <User className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="text-slate-500 text-sm font-medium">Active Clients</h3>
                  <p className="text-2xl font-bold text-slate-900">{clients || 0}</p>
                </div>
              </div>

              {/* Secondary Metrics Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Loss Card */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-orange-100">
                      <AlertTriangle className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <h3 className="text-slate-500 text-sm font-medium">Total Loss</h3>
                  <p className="text-2xl font-bold text-slate-900">{formatCurrency(loss)} Frw</p>
                </div>

                {/* Inventory Value */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-indigo-100">
                      <Package className="w-6 h-6 text-indigo-600" />
                    </div>
                  </div>
                  <h3 className="text-slate-500 text-sm font-medium">Inventory Value</h3>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatCurrency(inventorySummary?.totalStockValueAtSalePrice || 0)} Frw
                  </p>
                </div>

                {/* Low Stock Alert */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-red-100">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <h3 className="text-slate-500 text-sm font-medium">Low Stock Items</h3>
                  <p className="text-2xl font-bold text-slate-900">{lowStockItems.length}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 mb-8">
                {/* Low Stock Items */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-200">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      Low Stock Alert ({lowStockItems.length})
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-3">Product</th>
                          <th className="px-6 py-3 text-right">Current Stock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {lowStockItems.length > 0 ? (
                          lowStockItems.slice(0, 6).map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="px-6 py-4 font-medium text-slate-900">{item.productName || 'N/A'}</td>
                              <td className="px-6 py-4 text-right">
                                <span className="text-red-600 font-bold">{item.quantity || 0}</span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="2" className="px-6 py-4 text-center text-slate-500">No low stock items</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="font-bold text-slate-800 flex items-center gap-2">
                    <ReceiptText className="w-5 h-5 text-blue-500" />
                    Recent Transactions
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3">Type</th>
                        <th className="px-6 py-3">Description</th>
                        <th className="px-6 py-3 text-right">Amount</th>
                        <th className="px-6 py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentTransactions.length > 0 ? (
                        recentTransactions.map((transaction, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                transaction.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {transaction.type || 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-600">{transaction.description || 'N/A'}</td>
                            <td className="px-6 py-4 text-right font-bold text-slate-900">{formatCurrency(transaction.amount || 0)} Frw</td>
                            <td className="px-6 py-4 text-slate-500">
                              {transaction.date ? new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-6 py-4 text-center text-slate-500">No transaction data available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Reports;