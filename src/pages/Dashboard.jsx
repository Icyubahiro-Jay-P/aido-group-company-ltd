import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Box,
  ShoppingCart,
  AlertTriangle,
  DollarSign,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import PageBanner from '../components/PageBanner';
import StatCard from '../components/StatCard';
import { getInventorySummary, getLowStockItems } from '../api/reportServices';
import { getSales } from '../api/saleServices';
import { toast } from 'sonner';
import Loading from '../components/Loading';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
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
    <DashboardLayout title="Inventory Overview" brand="Dashboard" active="Dashboard">
          
          <PageBanner
            title="Inventory Overview"
            subtitle="Real-time stock levels and order status for building materials."
            icon={LayoutDashboard}
            gradient="from-emerald-600 to-teal-600"
          />

          {loading ? (
            <div className="flex items-center justify-center h-96">
              <Loading />
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <StatCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    iconBg={stat.bg}
                    iconColor={stat.color}
                  />
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
        </DashboardLayout>
  );
}