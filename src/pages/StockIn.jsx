import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, LayersPlus } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import PageBanner from '../components/PageBanner';
import ConfirmModal from '../components/ConfirmModal';
import { createProduct, getProducts, deleteProduct, updateProduct } from '../api/productServices';
import { toast } from 'sonner';

const StockIn = () => {
  const { user } = useOutletContext();
  const [formData, setFormData] = useState({
    productName: '',
    sku: '',
    quantity: '',
    unitPrice: '',
    purchasePrice: '',
  });
  const [stockItems, setStockItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  // Determine if current user has Boss privileges (used for conditional columns & actions)
  const isBoss = user.role === "Boss";

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setStockItems(response.products || []);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch stock items. Please try again.');
    }
  };
  
  useEffect(() => {
    getProducts()
      .then((response) => {
        setStockItems(response.products || []);
      })
      .catch((error) => {
        toast.error(error.message || "Failed to fetch stock items. Please try again.");
      });
  }, []);

  useEffect(() => {
    document.title = "AIDO Group Company Ltd - Stock In";
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update existing product
        const response = await updateProduct(editingId, formData);
        toast.success(response.message || 'Stock item updated successfully');
        setEditingId(null);
      } else {
        // Create new product
        const response = await createProduct(formData);
        toast.success(response.message || 'Stock item added successfully');
      }
      await fetchProducts();
      setFormData({ productName: '', sku: '', quantity: '', unitPrice: '', purchasePrice: '' });
    } catch (error) {
      toast.error(error.message || 'Failed to save stock item. Please try again.');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      productName: item.productName,
      sku: item.sku,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      purchasePrice: item.purchasePrice,
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id) => {
    setDeleteItemId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteProduct(deleteItemId);
      toast.success(response.message || 'Stock item deleted successfully');
      await fetchProducts();
      setShowDeleteModal(false);
      setDeleteItemId(null);
    } catch (error) {
      toast.error(error.message || 'Failed to delete stock item. Please try again.');
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeleteItemId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ productName: '', sku: '', quantity: '', unitPrice: '', purchasePrice: '' });
  };

  return (
    <DashboardLayout title="Add Stock" brand="Stock In" active="Stock in">
      <PageBanner
        title="Add Stock"
        subtitle="Add new products to the inventory and manage stock levels."
        icon={LayersPlus}
        gradient="from-purple-600 to-pink-600"
      />

          {/* Form */}

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              {editingId ? 'Edit Stock Item' : 'New Stock Item'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Product Name</label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  placeholder="Cement"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="CEM-001"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Unit Price</label>
                <input
                  type="number"
                  name="unitPrice"
                  value={formData.unitPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  min={0}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Purchase Price</label>
                <input
                  type="number"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  min={0}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="0"
                  min={0}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
                >
                  <Plus size={18} />
                  {editingId ? 'Update Item' : 'Add Item'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
          

          {/* Stock Items Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="font-bold text-slate-800">Stock Items</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3">Product Name</th>
                    <th className="px-6 py-3">SKU</th>
                    <th className="px-6 py-3">Unit Price</th>
                    <th className="px-6 py-3">Purchase Price</th>
                    <th className="px-6 py-3">Quantity</th>
                    {isBoss && (
                      <th className="px-6 py-3 text-center">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stockItems.length === 0 ? (
                    <tr>
                      <td 
                        className="px-6 py-4 text-center text-slate-500" 
                        colSpan={isBoss ? 6 : 5}
                      >
                        No stock items found.
                      </td>
                    </tr>
                  ) : (
                    stockItems.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{item.productName}</td>
                        <td className="px-6 py-4 text-slate-900">{item.sku}</td>
                        <td className="px-6 py-4 text-slate-900 font-medium">{item.unitPrice} Frw</td>
                        <td className="px-6 py-4 text-slate-900">{item.purchasePrice} Frw</td>
                        <td className="px-6 py-4 text-slate-900">{item.quantity}</td>
                        {/* Actions column only rendered for Boss */}
                        {isBoss && (
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button 
                                onClick={() => handleEdit(item)}
                                className="p-2 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors cursor-pointer"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteClick(item._id)}
                                className="p-2 text-red-600 hover:bg-red-200 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <p className="text-sm text-slate-600">Total items: <span className="font-semibold">{stockItems.length}</span></p>
              <p className="text-sm text-slate-600">
                Total value: <span className="font-semibold">
                  {stockItems
                    .reduce((total, item) => total + (Number(item.purchasePrice) || 0) * (Number(item.quantity) || 0), 0)
                    .toLocaleString()} Frw
                </span>
              </p>
            </div>
          </div>

      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmModal
        open={showDeleteModal}
        title="Delete Stock Item?"
        message={
          <>
            Are you sure you want to delete this stock item?
            <br />
            This action cannot be undone.
          </>
        }
        confirmText="Yes, Delete"
        cancelText="Cancel"
        icon={Trash2}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </DashboardLayout>
  );
};

export default StockIn;