import React, { useState, useEffect } from 'react';
import { Menu, Box, DollarSign, ShoppingCart, AlertTriangle,LayoutDashboard, Package, LayersPlus,BanknoteArrowUp,ReceiptText,TrendingUp,Settings,LogOut } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import NavbarItem from '../components/NavbarItem';

const Reports = () => {
  const { user } = useOutletContext();
  const [navbarOpen, setNavbarOpen] = useState(false);

  useEffect(() => {
    document.title = "AIDO Group Company Ltd - Reports";
  }, []);

  const reportStats = [
    { title: 'Total Sales', value: '$45,230', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Total Stock In', value: '$32,890', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Current Inventory Value', value: '$124,500', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Low Stock Items', value: '12', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  const salesData = [
    { month: 'January', sales: 4000, orders: 24 },
    { month: 'February', sales: 3000, orders: 18 },
    { month: 'March', sales: 2000, orders: 12 },
    { month: 'April', sales: 2780, orders: 39 },
    { month: 'May', sales: 1890, orders: 28 },
    { month: 'June', sales: 2390, orders: 35 },
  ];

  const topProducts = [
    { name: 'Portland Cement (94lb)', sold: 450, revenue: '$5,625' },
    { name: '2x4x8 Stud (SPF)', sold: 380, revenue: '$3,325' },
    { name: 'Drywall 4x8 (1/2")', sold: 260, revenue: '$4,157.40' },
    { name: '1/2" Copper Pipe', sold: 180, revenue: '$6,300' },
  ];

  const categoryRevenue = [
    { category: 'Masonry', revenue: '$12,450', percentage: 28 },
    { category: 'Lumber', revenue: '$18,900', percentage: 42 },
    { category: 'Plumbing', revenue: '$10,230', percentage: 23 },
    { category: 'Finishing', revenue: '$3,650', percentage: 8 },
  ];

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
                    {topProducts.map((product, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">{product.name}</td>
                        <td className="px-6 py-4 text-right text-slate-600">{product.sold}</td>
                        <td className="px-6 py-4 text-right text-slate-900 font-bold">{product.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Category Revenue */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h2 className="font-bold text-slate-800">Revenue by Category</h2>
              </div>
              <div className="p-6 space-y-4">
                {categoryRevenue.map((cat, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-900">{cat.category}</span>
                      <span className="text-sm font-bold text-slate-900">{cat.revenue}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full rounded-full transition-all"
                        style={{ width: `${cat.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{cat.percentage}% of total revenue</p>
                  </div>
                ))}
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
                  {salesData.map((data, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{data.month}</td>
                      <td className="px-6 py-4 text-right text-slate-900 font-bold">${data.sales}</td>
                      <td className="px-6 py-4 text-right text-slate-600">{data.orders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;