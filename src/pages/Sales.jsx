import React, { useState, useEffect } from 'react';
import { Menu, Box, Plus, Trash2, LayoutDashboard,ShoppingCart , Package, LayersPlus, BanknoteArrowUp, ReceiptText, TrendingUp, Settings, LogOut } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import NavbarItem from '../components/NavbarItem';
import { getProducts } from '../api/productServices';
import { createSale } from '../api/saleServices';
import { toast } from 'sonner';

const Sales = () => {
  const { user } = useOutletContext();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Format currency with commas
  const formatCurrency = (amount) => {
    return Math.round(amount).toLocaleString('en-US', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 2 
    });
  };

  // Form State - email & notes evicted like bad tenants
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    paymentMethod: 'Cash',
  });

  const [productRows, setProductRows] = useState([
    { id: 1, productId: '', productName: '', quantity: 1, unitPrice: 0, originalPrice: 0 }
  ]);

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    document.title = "AIDO Group Company Ltd - Sales";
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await getProducts();
      setProducts(response.products || []);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleProductChange = (id, field, value) => {
    setProductRows(productRows.map(row => {
      if (row.id === id) {
        if (field === 'productName') {
          const selectedProduct = products.find(p => p.productName === value);
          return {
            ...row,
            productId: selectedProduct ? selectedProduct._id : '',
            productName: value,
            originalPrice: selectedProduct ? selectedProduct.purchasePrice : 0,
            unitPrice: selectedProduct ? selectedProduct.unitPrice : 0
          };
        }
        return { ...row, [field]: value };
      }
      return row;
    }));
  };

  const handleAddProduct = () => {
    const newId = Math.max(...productRows.map(r => r.id), 0) + 1;
    setProductRows([...productRows, { id: newId, productId: '', productName: '', quantity: 1, unitPrice: 0, originalPrice: 0 }]);
  };

  const handleRemoveProduct = (id) => {
    if (productRows.length === 1) {
      toast.error('At least one product is required');
      return;
    }
    setProductRows(productRows.filter(row => row.id !== id));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.customerName.trim()) errors.customerName = 'Customer name is required';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    if (!formData.address.trim()) errors.address = 'Address is required';

    // Products validation + STOCK POLICE + PROFIT VALIDATION
    productRows.forEach((row, idx) => {
      if (!row.productName.trim()) {
        errors[`product_${idx}`] = 'Product name is required';      } else if (!row.productId) {
        errors[`product_${idx}`] = 'Please select a valid product';      } else {
        const selectedProduct = products.find(p => p.productName === row.productName);
        if (selectedProduct && row.quantity > (selectedProduct.quantity || 0)) {
          errors[`quantity_${idx}`] = `Only ${selectedProduct.quantity} left in stock`;
        }
        // Validate that unit price > purchase price
        if (row.unitPrice <= row.originalPrice) {
          errors[`unitPrice_${idx}`] = `Unit price (${row.unitPrice}) must be higher than purchase price (${row.originalPrice})`;
        }
      }
      if (row.quantity < 1) {
        errors[`quantity_${idx}`] = 'Quantity must be at least 1';
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateTotal = () => {
    return productRows.reduce((sum, row) => sum + (row.unitPrice * row.quantity), 0);
  };

  const calculateProductProfit = (row) => {
    if (row.unitPrice <= row.originalPrice) return 0;
    return (row.unitPrice - row.originalPrice) * row.quantity;
  };

  const calculateTotalProfit = () => {
    return productRows.reduce((sum, row) => sum + calculateProductProfit(row), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix all errors before submitting');
      return;
    }

    setSubmitting(true);
    try {
      const saleData = {
        clientName: formData.customerName,
        products: productRows.map(row => ({
          productId: row.productId,
          productName: row.productName,
          quantitySold: parseInt(row.quantity),
          unitPrice: row.unitPrice,
          totalPrice: row.unitPrice * row.quantity,
        })),
        totalAmount: calculateTotal(),
        paymentMethod: formData.paymentMethod,
        saleDate: new Date(),
      };

      await createSale(saleData);
      toast.success('Sale recorded successfully');

      // Reset form
      setFormData({
        customerName: '',
        phone: '',
        address: '',
        paymentMethod: 'Cash',
      });
      setProductRows([{ id: 1, productId: '', productName: '', quantity: 1, unitPrice: 0, originalPrice: 0 }]);
    } catch (error) {
      toast.error(error.message || 'Failed to create sale');
    } finally {
      setSubmitting(false);
    }
  };

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
        <div className="flex items-center justify-start px-4 h-16 border-b border-slate-200">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Box size={20} />
            </div>
            Sales
          </div>
        </div>

        <nav className="p-4 space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4 mt-4">
            Main
          </div>
          <NavbarItem icon={LayoutDashboard} label="Dashboard" />
          <NavbarItem icon={Package} label="Inventory" />
          {user.role === "Boss" && <NavbarItem icon={LayersPlus} label="Stock in" />}
          
          <NavbarItem icon={BanknoteArrowUp} label="Sales" active/>
          
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4 mt-6">
            System
          </div>
          <NavbarItem icon={ReceiptText} label="Reciepts" />
          {user.role === "Boss" && <NavbarItem icon={TrendingUp} label="Reports" />}
          <NavbarItem icon={Settings} label="Settings" />
          <NavbarItem icon={LogOut} label="Logout" isLogout={true} />
        </nav>
        
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
            <h1 className='text-2xl font-bold'>Record Sales Transaction</h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50">
          <div className="mb-8 bg-linear-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">New Sale</h1>
                <p className="text-orange-100">Fill in the customer details and add products to complete the sale.</p>
              </div>
              <div className="text-orange-200">
                <ShoppingCart size={48} />
              </div>
            </div>
            <div className="mt-4">
              <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg w-fit">
                <p className="text-xs text-orange-100">Total Items Selected</p>
                <p className="text-2xl font-bold">{productRows.filter(r => r.productName).length}</p>
              </div>
            </div>
          </div>
              <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Customer Details Section - email & notes gone, less clutter more cash */}
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Customer Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Customer Name *</label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      placeholder="Full names"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.customerName ? 'border-red-500' : 'border-slate-200'
                      }`}
                    />
                    {formErrors.customerName && (
                      <p className="text-red-600 text-xs mt-1">{formErrors.customerName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+250 XXX XXX XXX"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.phone ? 'border-red-500' : 'border-slate-200'
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="text-red-600 text-xs mt-1">{formErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street address"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.address ? 'border-red-500' : 'border-slate-200'
                      }`}
                    />
                    {formErrors.address && (
                      <p className="text-red-600 text-xs mt-1">{formErrors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Payment Method</label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Cash</option>
                      <option>MoMo</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Products Section - pro dropdown + stock enforcement + dual prices */}
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-900">Products</h3>
                  <button
                    type="button"
                    onClick={handleAddProduct}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={18} />
                    Add Product
                  </button>
                </div>

                {loadingProducts ? (
                  <p className="text-slate-500 text-center py-4">Loading products...</p>
                ) : (
                  <div className="space-y-3">
                    {productRows.map((row, idx) => (
                      <div key={row.id} className="flex items-end gap-2">
                        {/* Professional dropdown - no more fake datalist nonsense */}
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-slate-700 mb-1">Product Name *</label>
                          <select
                            value={row.productName}
                            onChange={(e) => handleProductChange(row.id, 'productName', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              formErrors[`product_${idx}`] ? 'border-red-500' : 'border-slate-200'
                            }`}
                          >
                            <option value="">-- Select a product --</option>
                            {products.map(product => (
                              <option key={product._id} value={product.productName}>
                                {product.productName} ({product.quantity || 0} in stock)
                              </option>
                            ))}
                          </select>
                          {formErrors[`product_${idx}`] && (
                            <p className="text-red-600 text-xs mt-1">{formErrors[`product_${idx}`]}</p>
                          )}
                        </div>

                        <div className="w-24">
                          <label className="block text-xs font-medium text-slate-700 mb-1">Qty *</label>
                          <input
                            type="number"
                            min="1"
                            value={row.quantity}
                            onChange={(e) => handleProductChange(row.id, 'quantity', parseInt(e.target.value) || 1)}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              formErrors[`quantity_${idx}`] ? 'border-red-500' : 'border-slate-200'
                            }`}
                          />
                          {formErrors[`quantity_${idx}`] && (
                            <p className="text-red-600 text-xs mt-1">{formErrors[`quantity_${idx}`]}</p>
                          )}
                        </div>

                        {/* NEW: Original price (locked) */}
                        <div className="w-24">
                          <label className="block text-xs font-medium text-slate-700 mb-1">Original</label>
                          <input
                            type="number"
                            value={row.originalPrice}
                            disabled
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-600"
                          />
                        </div>

                        {/* Price = unitPrice (editable now) */}
                        <div className="w-24">
                          <label className="block text-xs font-medium text-slate-700 mb-1">Unit Price</label>
                          <input
                            type="number"
                            value={row.unitPrice}
                            onChange={(e) => handleProductChange(row.id, 'unitPrice', Number(e.target.value) || 0)}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              formErrors[`unitPrice_${idx}`] ? 'border-red-500' : 'border-slate-200'
                            }`}
                          />
                          {formErrors[`unitPrice_${idx}`] && (
                            <p className="text-red-600 text-xs mt-1 whitespace-nowrap">{formErrors[`unitPrice_${idx}`]}</p>
                          )}
                        </div>

                        <div className="w-28">
                          <label className="block text-xs font-medium text-slate-700 mb-1">Total</label>
                          <div className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 font-semibold">
                            {formatCurrency(row.unitPrice * row.quantity)}
                          </div>
                        </div>

                        {/* Profit Display */}
                        <div className="w-28">
                          <label className="block text-xs font-medium text-green-700 mb-1">Profit</label>
                          <div className={`w-full px-3 py-2 border rounded-lg font-semibold ${
                            calculateProductProfit(row) > 0 
                              ? 'bg-green-50 border-green-200 text-green-700' 
                              : 'bg-red-50 border-red-200 text-red-700'
                          }`}>
                            {formatCurrency(calculateProductProfit(row))}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(row.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Summary Section - with profit tracking */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-slate-900">Total Amount (Sales):</span>
                    <span className="text-2xl font-bold text-blue-600">{formatCurrency(calculateTotal())} Frw</span>
                  </div>
                  {calculateTotalProfit() > 0 && (
                    <div className="flex justify-between items-center pt-3 border-t border-blue-200">
                      <span className="text-base font-semibold text-green-700">Total Profit:</span>
                      <span className="text-2xl font-bold text-green-600">+{formatCurrency(calculateTotalProfit())} Frw</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed font-semibold"
              >
                {submitting ? 'Processing...' : 'Complete Sale'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Sales;