import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, ChevronDown, X, Box, LayoutDashboard, Package, LayersPlus, BanknoteArrowUp, BanknoteArrowDown, ReceiptText, TrendingUp, Settings, LogOut, Menu, ShoppingCart } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import NavbarItem from '../components/NavbarItem';
import { createPurchase, getPurchases, deletePurchase, updatePurchase } from '../api/purchaseServices';
import { getProducts } from '../api/productServices';
import { toast } from 'sonner';

const Purchases = () => {
  const { user } = useOutletContext();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    supplierName: '',
    products: [],
    totalAmount: 0,
    paymentMethod: 'Cash',
    invoiceNumber: '',
    notes: '',
  });

  const [currentProduct, setCurrentProduct] = useState({
    productId: '',
    productName: '',
    quantityPurchased: '',
    unitCost: '',
    totalCost: 0,
  });

  const [productSearch, setProductSearch] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  useEffect(() => {
    document.title = "AIDO Group Company Ltd - Purchases";
    fetchPurchases();
    fetchProducts();
  }, []);

  const fetchPurchases = async () => {
    try {
      const response = await getPurchases();
      setPurchases(response.purchases || []);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch purchases');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.products || []);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch products');
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleProductSelect = (product) => {
    setCurrentProduct(prev => ({
      ...prev,
      productId: product._id,
      productName: product.productName,
    }));
    setProductSearch(product.productName);
    setShowProductDropdown(false);
  };

  const calculateProductTotal = () => {
    const quantity = parseFloat(currentProduct.quantityPurchased) || 0;
    const cost = parseFloat(currentProduct.unitCost) || 0;
    return (quantity * cost).toFixed(2);
  };

  const addProduct = () => {
    if (!currentProduct.productId || !currentProduct.quantityPurchased || !currentProduct.unitCost) {
      toast.error('Please fill in all product fields');
      return;
    }

    const newProduct = {
      ...currentProduct,
      quantityPurchased: parseInt(currentProduct.quantityPurchased),
      unitCost: parseFloat(currentProduct.unitCost),
      totalCost: parseFloat(calculateProductTotal()),
    };

    setFormData(prev => ({
      ...prev,
      products: [...prev.products, newProduct],
      totalAmount: prev.totalAmount + newProduct.totalCost,
    }));

    setCurrentProduct({
      productId: '',
      productName: '',
      quantityPurchased: '',
      unitCost: '',
      totalCost: 0,
    });
    setProductSearch('');
  };

  const removeProduct = (index) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
      totalAmount: prev.totalAmount - prev.products[index].totalCost,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.supplierName || formData.products.length === 0) {
      toast.error('Please enter supplier name and add at least one product');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await updatePurchase(editingId, formData);
        toast.success('Purchase updated successfully');
      } else {
        await createPurchase(formData);
        toast.success('Purchase created successfully');
      }
      
      resetForm();
      await fetchPurchases();
      setShowForm(false);
    } catch (error) {
      toast.error(error.message || 'Failed to save purchase');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      supplierName: '',
      products: [],
      totalAmount: 0,
      paymentMethod: 'Cash',
      invoiceNumber: '',
      notes: '',
    });
    setCurrentProduct({
      productId: '',
      productName: '',
      quantityPurchased: '',
      unitCost: '',
      totalCost: 0,
    });
    setProductSearch('');
    setEditingId(null);
  };

  const handleEdit = (purchase) => {
    setFormData(purchase);
    setEditingId(purchase._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id) => {
    setDeleteItemId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deletePurchase(deleteItemId);
      toast.success('Purchase deleted successfully');
      await fetchPurchases();
    } catch (error) {
      toast.error(error.message || 'Failed to delete purchase');
    } finally {
      setShowDeleteModal(false);
      setDeleteItemId(null);
    }
  };

  const filteredProducts = products.filter(p =>
    p.productName.toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleCancel = () => {
    resetForm();
    setShowForm(false);
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200
        transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static
        ${navbarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-start px-4 h-16 border-b border-slate-200">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Box size={20} />
            </div>
            AIDO
          </div>
        </div>

        <nav className="p-4 space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4 mt-4">
            Main
          </div>
          <NavbarItem icon={LayoutDashboard} label="Dashboard" />
          <NavbarItem icon={Package} label="Inventory" />
          <NavbarItem icon={LayersPlus} label="Stock in" />
          <NavbarItem icon={BanknoteArrowDown} label="Purchases" active/>
          <NavbarItem icon={BanknoteArrowUp} label="Sales" />
          
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4 mt-6">
            System
          </div>
          <NavbarItem icon={ReceiptText} label="Reciepts" />
          {user.role === "Boss" && <NavbarItem icon={TrendingUp} label="Reports" />}
          <NavbarItem icon={Settings} label="Settings" />
          <NavbarItem icon={LogOut} label="Logout" isLogout={true} />
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
              {user.fullName ? user.fullName.split(' ').map(n => n[0]).join('') : 'JD'}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">{user.fullName}</p>
              <p className="text-xs text-slate-500">{user.role}</p>
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
              onClick={() => setNavbarOpen(!navbarOpen)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-semibold text-slate-900">Purchases</h1>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <main className="p-4 lg:p-8 bg-slate-50">
            <div className="max-w-7xl mx-auto">
              {/* Header Banner */}
              <div className="mb-8 bg-linear-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">Purchases</h1>
                    <p className="text-blue-100">
                      Manage supplier purchases and add new stock to your inventory.
                    </p>
                  </div>
                  <div className="text-blue-200">
                    <ShoppingCart size={48} />
                  </div>
                </div>
              </div>

              {/* Form */}
              {showForm && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <h2 className="text-2xl font-bold mb-6">
                    {editingId ? 'Edit Purchase' : 'New Purchase Order'}
                  </h2>

                  <form onSubmit={handleSubmit}>
                    {/* Supplier & Payment Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Supplier Name *</label>
                        <input
                          type="text"
                          name="supplierName"
                          value={formData.supplierName}
                          onChange={handleFormChange}
                          placeholder="Enter supplier name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method *</label>
                        <select
                          name="paymentMethod"
                          value={formData.paymentMethod}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Cash">Cash</option>
                          <option value="MoMo">MoMo</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Invoice Number</label>
                        <input
                          type="text"
                          name="invoiceNumber"
                          value={formData.invoiceNumber}
                          onChange={handleFormChange}
                          placeholder="Enter invoice number"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
                        <input
                          type="text"
                          name="notes"
                          value={formData.notes}
                          onChange={handleFormChange}
                          placeholder="Add any notes"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Add Products Section */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h3 className="text-lg font-semibold mb-4">Add Products</h3>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="relative">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Product *</label>
                          <div
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer flex items-center justify-between"
                            onClick={() => setShowProductDropdown(!showProductDropdown)}
                          >
                            <span>{productSearch || 'Select product...'}</span>
                            <ChevronDown size={16} />
                          </div>

                          {showProductDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                              <input
                                type="text"
                                placeholder="Search products..."
                                value={productSearch}
                                onChange={(e) => setProductSearch(e.target.value)}
                                className="w-full px-4 py-2 border-b"
                                onClick={(e) => e.stopPropagation()}
                              />
                              {filteredProducts.map(product => (
                                <div
                                  key={product._id}
                                  onClick={() => handleProductSelect(product)}
                                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                                >
                                  <p className="font-semibold">{product.productName}</p>
                                  <p className="text-xs text-gray-600">SKU: {product.sku}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity *</label>
                          <input
                            type="number"
                            name="quantityPurchased"
                            value={currentProduct.quantityPurchased}
                            onChange={handleProductChange}
                            min="1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Unit Cost *</label>
                          <input
                            type="number"
                            name="unitCost"
                            value={currentProduct.unitCost}
                            onChange={handleProductChange}
                            step="0.01"
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Total</label>
                          <div className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg font-semibold">
                            ${calculateProductTotal()}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={addProduct}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2"
                      >
                        <Plus size={18} /> Add Product
                      </button>
                    </div>

                    {/* Added Products Table */}
                    {formData.products.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4">Products in Order</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-200">
                              <tr>
                                <th className="px-4 py-2 text-left">Product</th>
                                <th className="px-4 py-2 text-center">Qty</th>
                                <th className="px-4 py-2 text-right">Unit Cost</th>
                                <th className="px-4 py-2 text-right">Total</th>
                                <th className="px-4 py-2 text-center">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {formData.products.map((product, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50">
                                  <td className="px-4 py-2">{product.productName}</td>
                                  <td className="px-4 py-2 text-center">{product.quantityPurchased}</td>
                                  <td className="px-4 py-2 text-right">${product.unitCost.toFixed(2)}</td>
                                  <td className="px-4 py-2 text-right font-semibold">${product.totalCost.toFixed(2)}</td>
                                  <td className="px-4 py-2 text-center">
                                    <button
                                      type="button"
                                      onClick={() => removeProduct(index)}
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      <X size={18} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="mt-4 flex justify-end">
                          <div className="bg-gray-100 rounded-lg p-4 w-full md:w-64">
                            <div className="flex justify-between font-bold text-lg">
                              <span>Total Amount:</span>
                              <span className="text-green-600">${formData.totalAmount.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Submit Buttons */}
                    <div className="flex gap-4 mt-6">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg"
                      >
                        {loading ? 'Saving...' : editingId ? 'Update Purchase' : 'Create Purchase'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* New Purchase Button */}
              {!showForm && (
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(true);
                  }}
                  className="mb-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2"
                >
                  <Plus size={20} /> New Purchase
                </button>
              )}

              {/* Purchase History */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">Purchase History</h2>
                </div>

                {purchases.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    No purchases yet. Go create one.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-6 py-3 text-left">Date</th>
                          <th className="px-6 py-3 text-left">Supplier</th>
                          <th className="px-6 py-3 text-left">Invoice</th>
                          <th className="px-6 py-3 text-center">Items</th>
                          <th className="px-6 py-3 text-right">Total</th>
                          <th className="px-6 py-3 text-center">Payment</th>
                          {user.role === "Boss" && <th className="px-6 py-3 text-center">Actions</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {purchases.map(purchase => (
                          <tr key={purchase._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">{new Date(purchase.purchaseDate).toLocaleDateString()}</td>
                            <td className="px-6 py-4 font-semibold">{purchase.supplierName}</td>
                            <td className="px-6 py-4">{purchase.invoiceNumber || '-'}</td>
                            <td className="px-6 py-4 text-center">{purchase.products.length}</td>
                            <td className="px-6 py-4 text-right font-bold">${purchase.totalAmount.toFixed(2)}</td>
                            <td className="px-6 py-4 text-center">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                purchase.paymentMethod === 'Cash' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {purchase.paymentMethod}
                              </span>
                            </td>
                            {user.role === "Boss" && (
                              <td className="px-6 py-4 text-center">
                                <div className="flex justify-center gap-3">
                                  <button onClick={() => handleEdit(purchase)} className="text-blue-600 hover:text-blue-800">
                                    <Edit2 size={18} />
                                  </button>
                                  <button onClick={() => handleDeleteClick(purchase._id)} className="text-red-600 hover:text-red-800">
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Delete this purchase? Stock will be reduced too. No take-backs.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteItemId(null);
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 py-2 rounded-lg font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-bold"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Purchases;