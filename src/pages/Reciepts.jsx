import React, { useState, useEffect } from 'react';
import { Search, Menu, Box, Download, LayoutDashboard, Package, LayersPlus, BanknoteArrowUp, ReceiptText, TrendingUp, Settings, LogOut, Trash2, Eye, ChevronDown } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import NavbarItem from '../components/NavbarItem';
import { getPurchases, deletePurchase } from '../api/purchaseServices';
import { exportReceiptsToPDF } from '../utils/pdfExport';
import { toast } from 'sonner';

const Receipts = () => {
  const { user } = useOutletContext();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [filterPayment, setFilterPayment] = useState('All');

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const response = await getPurchases();
      setPurchases(response.purchases || []);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch purchase receipts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  useEffect(() => {
    document.title = "AIDO Group Company Ltd - Receipts";
  }, []);

  const handleDeletePurchase = async (id) => {
    if (window.confirm('Are you sure you want to delete this receipt?')) {
      try {
        await deletePurchase(id);
        toast.success('Receipt deleted successfully');
        setPurchases(purchases.filter(p => p._id !== id));
      } catch (error) {
        toast.error(error.message || 'Failed to delete receipt');
      }
    }
  };

  const handleExportPDF = async () => {
    try {
      await exportReceiptsToPDF(filteredPurchases, 'purchase-receipts');
      toast.success('Receipts exported to PDF successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to export PDF');
    }
  };

  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = 
      purchase.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (purchase.invoiceNumber && purchase.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPayment = filterPayment === 'All' || purchase.paymentMethod === filterPayment;
    
    return matchesSearch && matchesPayment;
  });

  const totalPurchaseAmount = filteredPurchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
  const totalPurchases = filteredPurchases.length;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
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
          <NavbarItem icon={LayoutDashboard} label="Dashboard" />
          <NavbarItem icon={Package} label="Inventory" />
          {user.role === "Boss" && <NavbarItem icon={LayersPlus} label="Stock in" />}
          <NavbarItem icon={BanknoteArrowUp} label="Sales" />
          
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4 mt-6">
            System
          </div>
          <NavbarItem icon={ReceiptText} label="Reciepts" active />
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setNavbarOpen(!navbarOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-2xl font-bold text-slate-900">Purchase Receipts</h1>
          </div>
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={18} />
            Export
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <p className="text-slate-500 text-sm mb-2">Total Receipts</p>
              <p className="text-3xl font-bold text-slate-900">{totalPurchases}</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <p className="text-slate-500 text-sm mb-2">Total Amount</p>
              <p className="text-3xl font-bold text-slate-900">{formatCurrency(totalPurchaseAmount)}</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <p className="text-slate-500 text-sm mb-2">Average Purchase</p>
              <p className="text-3xl font-bold text-slate-900">
                {totalPurchases > 0 ? formatCurrency(totalPurchaseAmount / totalPurchases) : 'Fr0'}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <p className="text-slate-500 text-sm mb-2">Payment Methods</p>
              <p className="text-3xl font-bold text-slate-900">{new Set(purchases.map(p => p.paymentMethod)).size}</p>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by supplier name or invoice number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={filterPayment}
                onChange={(e) => setFilterPayment(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>All Payment Methods</option>
                <option>Cash</option>
                <option>Card</option>
                <option>Check</option>
                <option>Transfer</option>
              </select>
            </div>
          </div>

          {/* Receipts Table */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <p className="text-slate-500">Loading receipts...</p>
              </div>
            ) : filteredPurchases.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-slate-500">No receipts found. {searchTerm && 'Try adjusting your search.'}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Supplier</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Invoice #</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Items</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Payment Method</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">Total Amount</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredPurchases.map((purchase) => (
                      <React.Fragment key={purchase._id}>
                        <tr className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-slate-900">{purchase.supplierName}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{purchase.invoiceNumber || '-'}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{formatDate(purchase.purchaseDate)}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{purchase.products.length} item{purchase.products.length !== 1 ? 's' : ''}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              purchase.paymentMethod === 'Cash' ? 'bg-green-100 text-green-700' :
                              purchase.paymentMethod === 'Card' ? 'bg-blue-100 text-blue-700' :
                              purchase.paymentMethod === 'Check' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {purchase.paymentMethod}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-slate-900 text-right">{formatCurrency(purchase.totalAmount)}</td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setExpandedRow(expandedRow === purchase._id ? null : purchase._id)}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                title="View details"
                              >
                                {expandedRow === purchase._id ? (
                                  <ChevronDown size={18} className="text-slate-600" />
                                ) : (
                                  <Eye size={18} className="text-slate-600" />
                                )}
                              </button>
                              {user.role === "Boss" && (
                                <button
                                  onClick={() => handleDeletePurchase(purchase._id)}
                                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                  title="Delete receipt"
                                >
                                  <Trash2 size={18} className="text-red-600" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                        {expandedRow === purchase._id && (
                          <tr className="bg-slate-50 border-t-2 border-slate-200">
                            <td colSpan="7" className="px-6 py-4">
                              <div className="space-y-4">
                                {purchase.notes && (
                                  <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase">Notes</p>
                                    <p className="text-sm text-slate-700 mt-1">{purchase.notes}</p>
                                  </div>
                                )}
                                <div>
                                  <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Items Purchased</p>
                                  <div className="space-y-2">
                                    {purchase.products.map((product, idx) => (
                                      <div key={idx} className="flex justify-between items-start bg-white p-2 rounded border border-slate-200">
                                        <div>
                                          <p className="text-sm font-medium text-slate-900">{product.productName}</p>
                                          <p className="text-xs text-slate-500">Qty: {product.quantityPurchased} × {formatCurrency(product.unitCost)}</p>
                                        </div>
                                        <p className="text-sm font-semibold text-slate-900">{formatCurrency(product.totalCost)}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Receipts;
