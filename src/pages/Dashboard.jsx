import React, { useState, useEffect, use } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Search, 
  Menu, 
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Box,
  LogOut,
  LayersPlus,
  BanknoteArrowUp,
  ReceiptText,
  Clock
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import NavbarItem from '../components/NavbarItem';

// --- Mock Data ---
const stats = [
  { 
    title: 'Total Inventory Value', 
    value: '$124,500', 
    icon: DollarSign, 
    color: 'text-blue-600', 
    bg: 'bg-blue-100' 
  },
  { 
    title: 'Low Stock Items', 
    value: '12', 
    icon: AlertTriangle, 
    color: 'text-red-600', 
    bg: 'bg-red-100' 
  },
  { 
    title: 'Pending Orders', 
    value: '8', 
    icon: ShoppingCart, 
    color: 'text-orange-600', 
    bg: 'bg-orange-100' 
  },
  { 
    title: 'Total SKUs', 
    value: '1,450', 
    icon: Box, 
    color: 'text-emerald-600', 
    bg: 'bg-emerald-100' 
  },
];

const recentOrders = [
  { id: '#ORD-7752', customer: 'Apex Construction', date: 'Oct 24, 2023', total: '$4,200.00', status: 'Processing' },
  { id: '#ORD-7751', customer: 'Greenwood Builders', date: 'Oct 24, 2023', total: '$1,850.50', status: 'Shipped' },
  { id: '#ORD-7750', customer: 'Urban Renovations', date: 'Oct 23, 2023', total: '$890.00', status: 'Delivered' },
  { id: '#ORD-7749', customer: 'Smith Residential', date: 'Oct 23, 2023', total: '$2,100.25', status: 'Processing' },
];

const lowStockItems = [
  { name: 'Portland Cement (94lb)', sku: 'CEM-001', stock: 14, threshold: 50, category: 'Masonry' },
  { name: '2x4x8 Stud (SPF)', sku: 'LUM-204', stock: 45, threshold: 100, category: 'Lumber' },
  { name: '1/2" Copper Pipe', sku: 'PLB-102', stock: 8, threshold: 20, category: 'Plumbing' },
  { name: 'Drywall 4x8 (1/2")', sku: 'FIN-404', stock: 22, threshold: 40, category: 'Finishing' },
];

const StatusBadge = ({ status }) => {
  const getStyles = (status) => {
    switch (status) {
      case 'Processing':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Shipped':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyles(status)}`}>
      {status}
    </span>
  );
};



export default function Dashboard() {
  const { user } = useOutletContext();
  const [navbarOpen, setNavbarOpen] = useState(false);
  useEffect(() => {
    document.title = "AIDO Group Company Ltd - Dashboard";
  })
  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Mobile Navbar Overlay */}
      {navbarOpen && (
        <div 
          className="fixed inset-0 bg-white z-20 lg:hidden"
          onClick={() => setNavbarOpen(false)}
        />
      )}

      {/* Sidebar / Navbar */}
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
          <NavbarItem icon={LayoutDashboard} label="Dashboard" active />
          <NavbarItem icon={Package} label="Inventory" />
          {user.role === "Boss" && <NavbarItem icon={LayersPlus} label="Stock in" />}
          
          <NavbarItem icon={BanknoteArrowUp} label="Sales" />
          
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4 mt-6">
            System
          </div>
          <NavbarItem icon={ReceiptText} label="Reciepts" />
          {user.role === "Boss" && <NavbarItem icon={TrendingUp} label="Reports" />}
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setNavbarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md"
            >
              <Menu size={20} />
            </button>
          </div>
          <div></div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50">
          
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Inventory Overview</h1>
            <p className="text-slate-500 mt-1">
              Real-time stock levels and order status for building materials.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Low Stock Alerts */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Low Stock Alerts
                </h2>
                <button className="text-sm text-blue-600 font-medium hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3">Item Name</th>
                      <th className="px-6 py-3">SKU</th>
                      <th className="px-6 py-3">Category</th>
                      <th className="px-6 py-3 text-right">Stock Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {lowStockItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                        <td className="px-6 py-4 text-slate-500 font-mono text-xs">{item.sku}</td>
                        <td className="px-6 py-4 text-slate-500">
                          <span className="px-2 py-1 bg-slate-100 rounded text-xs">{item.category}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-red-600 font-bold">{item.stock}</span>
                          <span className="text-slate-400 text-xs"> / {item.threshold}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h2 className="font-bold text-slate-800">Recent Orders</h2>
              </div>
              <div className="p-0">
                {recentOrders.map((order, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-slate-900">{order.id}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{order.customer}</p>
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <span>{order.date}</span>
                      <span className="font-medium text-slate-900">{order.total}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
                <button className="text-sm text-blue-600  font-medium hover:text-blue-700">
                  Manage All Orders
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}