import React, { useState, useEffect } from 'react';
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
  BanknoteArrowDown,
  ReceiptText,
  Clock
} from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import NavbarItem from '../components/NavbarItem';
import { getInventorySummary, getLowStockItems } from '../api/reportServices';
import { getSales } from '../api/saleServices';
import { getProducts } from '../api/productServices';
import { toast } from 'sonner';
import Loading from '../components/Loading';

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
  const [loading, setLoading] = useState(true);
  const [inventorySummary, setInventorySummary] = useState(null);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [stats, setStats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "AIDO Group Company Ltd - Dashboard";
  }, []);

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch inventory summary
        const summaryData = await getInventorySummary();
        setInventorySummary(summaryData);

        // Fetch low stock items
        const lowStockData = await getLowStockItems(10);
        setLowStockItems(lowStockData);

        // Fetch recent sales
        const salesData = await getSales();
        if (salesData.sales && Array.isArray(salesData.sales)) {
          // Sort by date and take last 4 recent sales
          const recent = salesData.sales
            .sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate))
            .slice(0, 4);
          setRecentSales(recent);
        }

        // Build stats from fetched data
        if (summaryData) {
          const calculatedStats = [
            { 
              title: 'Total Inventory Value', 
              value: `${(summaryData.totalStockValueAtSalePrice || 0).toLocaleString('en-US')} Frw`, 
              icon: DollarSign, 
              color: 'text-blue-600', 
              bg: 'bg-blue-100' 
            },
            { 
              title: 'Low Stock Items', 
              value: (summaryData.lowStockCount || 0).toString(), 
              icon: AlertTriangle, 
              color: 'text-red-600', 
              bg: 'bg-red-100' 
            },
            { 
              title: 'Recent Sales', 
              value: (recentSales.length).toString(), 
              icon: ShoppingCart, 
              color: 'text-orange-600', 
              bg: 'bg-orange-100' 
            },
            { 
              title: 'Total SKUs', 
              value: (summaryData.totalProducts || 0).toString(), 
              icon: Box, 
              color: 'text-emerald-600', 
              bg: 'bg-emerald-100' 
            },
          ];
          setStats(calculatedStats);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error(error.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
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
        
        <div className="flex items-center justify-start px-4 h-16 border-b border-slate-200">
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
          <NavbarItem icon={LayersPlus} label="Stock in" />
          <NavbarItem icon={BanknoteArrowDown} label="Purchases" />
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
            <h1 className='text-2xl font-bold'>Inventory Overview</h1>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50">
          
          <div className="mb-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Inventory Overview</h1>
                <p className="text-emerald-100">
                  Real-time stock levels and order status for building materials.
                </p>
              </div>
              <div className="text-emerald-200">
                <LayoutDashboard size={48} />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-96">
              <Loading />
            </div>
          ) : (
            <>
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
                        {lowStockItems.length > 0 ? (
                          lowStockItems.slice(0, 4).map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="px-6 py-4 font-medium text-slate-900">{item.productName || 'N/A'}</td>
                              <td className="px-6 py-4 text-slate-500 font-mono text-xs">{item._id.substring(0, 8) || 'N/A'}</td>
                              <td className="px-6 py-4 text-slate-500">
                                <span className="px-2 py-1 bg-slate-100 rounded text-xs">Stock</span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <span className="text-red-600 font-bold">{item.quantity}</span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="px-6 py-4 text-center text-slate-500">No low stock items</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent Sales */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-200">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-orange-500" />
                      Recent Sales
                    </h2>
                  </div>
                  <div className="p-0 max-h-96 overflow-y-auto">
                    {recentSales.length > 0 ? (
                      recentSales.map((sale, idx) => {
                        const saleDate = new Date(sale.saleDate);
                        const formattedDate = saleDate.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        });
                        const formattedTime = saleDate.toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: true 
                        });
                        const totalAmount = sale.products?.reduce((sum, p) => sum + (p.totalPrice || 0), 0) || 0;
                        const itemCount = sale.products?.length || 0;
                        const productNames = sale.products?.slice(0, 2).map(p => p.productName).join(', ') || 'No items';
                        const hasMore = itemCount > 2;
                        
                        return (
                          <div 
                            key={idx} 
                            className="p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer group"
                          >
                            {/* Header Row */}
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className="font-semibold text-slate-900">#{sale._id.substring(0, 8)}</span>
                                <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                                  {itemCount} item{itemCount !== 1 ? 's' : ''}
                                </span>
                              </div>
                              <span className="text-sm font-bold text-slate-900">{(totalAmount || 0).toLocaleString('en-US')} Frw</span>
                            </div>

                            {/* Client and Time */}
                            <p className="text-sm text-slate-900 font-medium mb-1">{sale.clientName || 'Walk-in Customer'}</p>
                            <p className="text-xs text-slate-500 mb-2">{formattedDate} at {formattedTime}</p>

                            {/* Products Preview */}
                            <div className="text-xs text-slate-600 bg-slate-50 px-2.5 py-2 rounded mb-2 line-clamp-2">
                              <span className="font-medium">Items:</span> {productNames}
                              {hasMore && <span className="text-slate-500"> +{itemCount - 2} more</span>}
                            </div>

                            {/* Action Indicator */}
                            <div className="text-xs text-blue-600 font-medium group-hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity">
                              Click to view details →
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center">
                        <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                        <p className="text-slate-500 text-sm">No sales yet</p>
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
                    <button className="text-sm cursor-pointer text-blue-600 font-medium hover:text-blue-700 transition-colors" onClick={()=> navigate('/reciepts')}>
                      View All Sales →
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}