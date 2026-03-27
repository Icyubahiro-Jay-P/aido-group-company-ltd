import React, { useState, useEffect } from 'react';
import { Search, Menu, Box, Download, LayoutDashboard, Package, LayersPlus,BanknoteArrowUp,ReceiptText,TrendingUp,Settings,LogOut } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import NavbarItem from '../components/NavbarItem';
import { getProducts } from '../api/productServices';
import { toast } from 'sonner';

const Inventory = () => {
  const { user } = useOutletContext();
  const [navbarOpen, setNavbarOpen] = useState(false);
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
          <NavbarItem icon={Package} label="Inventory" active />
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

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setNavbarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-semibold text-slate-900">Inventory</h2>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Complete Inventory</h1>
            <p className="text-slate-500 mt-1">View all items currently in stock across all categories.</p>
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
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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
        </main>
      </div>
    </div>
  );
};

export default Inventory;
