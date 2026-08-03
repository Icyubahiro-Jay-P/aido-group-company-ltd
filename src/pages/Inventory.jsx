import React, { useState, useEffect } from 'react';
import { Search, Download, Package } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { getProducts } from '../api/productServices';
import { toast } from 'sonner';

const Inventory = () => {
  const { user } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [inventoryItems, setInventoryItems] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setInventoryItems(response.products || []);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch inventory items. Please try again.');
    }
  };

  const formatCurrency = (amount) => {
    return (amount || 0).toLocaleString('en-US');
  };
  
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    document.title = "AIDO Group Company Ltd - Inventory";
  }, []);


  const filteredItems = inventoryItems.filter(item =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValue = filteredItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  const handleExportPDF = async () => {
    try {
      const { exportInventoryToPDF } = await import('../utils/pdfExport');
      await exportInventoryToPDF(filteredItems, 'inventory-report');
      toast.success('Inventory exported to PDF successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to export PDF');
    }
  };

  return (
    <DashboardLayout title="Complete Inventory" brand="Inventory" active="Inventory">
      <div className="mb-8 bg-linear-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Complete Inventory</h1>
                <p className="text-blue-100">View all items currently in stock across all categories.</p>
              </div>
              <div className="text-blue-200">
                <Package size={48} />
              </div>
            </div>
            <div className="mt-4 flex gap-4 flex-wrap">
              <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
                <p className="text-xs text-blue-100">Total Items</p>
                <p className="text-xl font-bold">{inventoryItems.length}</p>
              </div>
              <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
                <p className="text-xs text-blue-100">Total Value</p>
                <p className="text-xl font-bold">{formatCurrency(totalValue)} Frw</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by product name or SKU..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button 
                  onClick={handleExportPDF}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto"
                >
                  <Download size={18} />
                  Export
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3">Product Name</th>
                    <th className="px-6 py-3">SKU</th>
                    <th className="px-6 py-3 text-right">Quantity</th>
                    <th className="px-6 py-3 text-right">Unit Price</th>
                    <th className="px-6 py-3 text-right">Total Value</th>
                    <th className="px-6 py-3">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td className="px-6 py-4 text-center text-slate-500" colSpan="6">
                        No inventory items found.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{item.productName}</td>
                        <td className="px-6 py-4 text-slate-500 font-mono text-xs">{item.sku}</td>
                        <td className="px-6 py-4 text-right text-slate-900 font-medium">{item.quantity}</td>
                        <td className="px-6 py-4 text-right text-slate-600">{item.unitPrice} Frw</td>
                        <td className="px-6 py-4 text-right text-slate-900 font-bold">{(item.unitPrice * item.quantity).toLocaleString()} Frw</td>
                        <td className="px-6 py-4 text-slate-500 text-xs">
                          {new Date(item.updatedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <p className="text-sm text-slate-600">Showing <span className="font-semibold">{filteredItems.length}</span> of <span className="font-semibold">{inventoryItems.length}</span> items</p>
              <p className="text-sm font-semibold text-slate-900">Total Inventory Value: <span className="text-blue-600">{totalValue.toLocaleString()} Frw</span></p>
            </div>
          </div>
    </DashboardLayout>
  );
};

export default Inventory;
