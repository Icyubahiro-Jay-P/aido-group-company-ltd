import React, { useState, useEffect } from 'react';
import { Menu, Box, DollarSign, ShoppingCart, AlertTriangle,LayoutDashboard, Package, LayersPlus,BanknoteArrowUp,ReceiptText,TrendingUp,Settings,LogOut } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import NavbarItem from '../components/NavbarItem';
import { getMonthlyIncome, getMonthlyExpense, getTopSellingProducts, getInventorySummary, getLowStockItems } from '../api/reportServices';
import { toast } from 'sonner';

const Reports = () => {
  const { user } = useOutletContext();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reportStats, setReportStats] = useState([
    { title: 'Total Sales', value: 'Fr0', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Total Stock In', value: 'Fr0', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Current Inventory Value', value: 'Fr0', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Low Stock Items', value: '0', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
  ]);
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
    }).format(amount);
  };

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Fetch monthly income and expense data
      const incomeResponse = await getMonthlyIncome();
      const expenseResponse = await getMonthlyExpense();
      const topProductsResponse = await getTopSellingProducts();
      const inventorySummaryResponse = await getInventorySummary();
      const lowStockResponse = await getLowStockItems();

      // Process monthly data
      const monthlyData = (incomeResponse.data || []).map((item, idx) => ({
        month: item.month || ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][idx] || `Month ${idx + 1}`,
        sales: item.income || 0,
        orders: item.orders || 0,
      }));
      setSalesData(monthlyData);

      // Process top products
      const products = (topProductsResponse.data || []).map(product => ({
        name: product.productName || product.name || 'Unknown Product',
        sold: product.totalQuantitySold || product.quantity || 0,
        revenue: formatCurrency(product.totalRevenue || product.sales || 0),
      }));
      setTopProducts(products);

      // Update stats
      const totalIncome = incomeResponse.data?.reduce((sum, item) => sum + (item.income || 0), 0) || 0;
      const inventoryValue = inventorySummaryResponse.data?.totalValue || 0;
      const lowStockCount = lowStockResponse.data?.length || 0;

      setReportStats([
        { title: 'Total Sales', value: formatCurrency(totalIncome), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
        { title: 'Total Stock In', value: formatCurrency(0), icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-100' },
        { title: 'Current Inventory Value', value: formatCurrency(inventoryValue), icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
        { title: 'Low Stock Items', value: lowStockCount.toString(), icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
      ]);
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
  }, []);

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
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Business Reports</h1>
            <p className="text-slate-500 mt-1">Overview of sales, stock, and inventory metrics.</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-slate-500">Loading reports...</p>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {reportStats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${stat.bg}`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                    <h3 className="text-slate-500 text-sm font-medium">{stat.title}</h3>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Top Products */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-200">
                    <h2 className="font-bold text-slate-800">Top Selling Products</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-3">Product Name</th>
                          <th className="px-6 py-3 text-right">Sold</th>
                          <th className="px-6 py-3 text-right">Revenue</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {topProducts.length > 0 ? (
                          topProducts.map((product, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="px-6 py-4 font-medium text-slate-900">{product.name}</td>
                              <td className="px-6 py-4 text-right text-slate-600">{product.sold}</td>
                              <td className="px-6 py-4 text-right text-slate-900 font-bold">{product.revenue}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className="px-6 py-4 text-center text-slate-500">No product data available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Inventory Summary */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-200">
                    <h2 className="font-bold text-slate-800">System Information</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                      <span className="text-sm font-medium text-slate-700">Total Products</span>
                      <span className="text-lg font-bold text-slate-900">--</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                      <span className="text-sm font-medium text-slate-700">Total Transactions</span>
                      <span className="text-lg font-bold text-slate-900">--</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-700">Data Last Updated</span>
                      <span className="text-sm text-slate-600">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly Sales Data */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="font-bold text-slate-800">Monthly Sales Summary</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3">Month</th>
                        <th className="px-6 py-3 text-right">Sales</th>
                        <th className="px-6 py-3 text-right">Orders</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {salesData.length > 0 ? (
                        salesData.map((data, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="px-6 py-4 font-medium text-slate-900">{data.month}</td>
                            <td className="px-6 py-4 text-right text-slate-900 font-bold">{data.sales}</td>
                            <td className="px-6 py-4 text-right text-slate-600">{data.orders}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="px-6 py-4 text-center text-slate-500">No sales data available</td>
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