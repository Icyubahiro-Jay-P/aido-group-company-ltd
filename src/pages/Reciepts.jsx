import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  ReceiptText,
  Trash2,
  Eye,
  ChevronDown,
  X,
  Printer,
  FileDown,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import PageBanner from "../components/PageBanner";
import StatCard from "../components/StatCard";
import ConfirmModal from "../components/ConfirmModal";
import { getSales, deleteSale } from "../api/saleServices";
import { exportReceiptsToPDF } from "../utils/pdfExport";
import { useBranch } from "../context/branch";
import { printReceipt, downloadReceiptPdf } from "../utils/receipt";
import { toast } from "sonner";

const Receipts = () => {
  const { user } = useOutletContext();
  const { branch } = useBranch();
  const [searchTerm, setSearchTerm] = useState("");
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [exportOptions, setExportOptions] = useState({
    type: "sale", // 'sale' or 'report'
    period: "all", // 'day', 'week', 'month', 'year', 'all'
  });

  const fetchSales = async () => {
    setLoading(true);
    try {
      const response = await getSales();
      setSales(response.sales || []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch sales. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    document.title = "AIDO Group Company Ltd - Sales Receipts";
  }, []);

  const handleDeleteSale = (id) => {
    setDeleteConfirmId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteSale(deleteConfirmId);
      toast.success("Sale deleted successfully");
      setSales(sales.filter((s) => s._id !== deleteConfirmId));
      setShowDeleteModal(false);
      setDeleteConfirmId(null);
    } catch (error) {
      toast.error(error.message || "Failed to delete sale");
    }
  };

  // Filter sales by time period
  const getFilteredSalesByPeriod = (salesToFilter) => {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    return salesToFilter.filter((sale) => {
      const saleDate = new Date(sale.saleDate);

      switch (exportOptions.period) {
        case "day":
          return saleDate >= startOfToday;
        case "week":
          return saleDate >= startOfWeek;
        case "month":
          return saleDate >= startOfMonth;
        case "year":
          return saleDate >= startOfYear;
        default:
          return true;
      }
    });
  };

  const handleExportPDF = async () => {
    try {
      const salesToExport = getFilteredSalesByPeriod(filteredSales);

      if (salesToExport.length === 0) {
        toast.error(
          `No sales data available for the selected ${exportOptions.period || "period"}`,
        );
        setShowExportModal(false);
        return;
      }

      const filename = `sales-${exportOptions.type}-${exportOptions.period}-${Date.now()}`;
      await exportReceiptsToPDF(salesToExport, filename);
      toast.success("Sales exported to PDF successfully");
      setShowExportModal(false);
    } catch (error) {
      toast.error(error.message || "Failed to export PDF");
    }
  };

  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      (sale.clientName &&
        sale.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (sale._id && sale._id.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  const totalSalesAmount = filteredSales.reduce((sum, sale) => {
    return (
      sum +
      (sale.products?.reduce((psum, p) => psum + (p.totalPrice || 0), 0) || 0)
    );
  }, 0);
  const totalSales = filteredSales.length;

  const formatCurrency = (amount) => {
    return (amount || 0).toLocaleString("en-US");
  };

  const formatDateTime = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <DashboardLayout
      title="Sales Receipts"
      brand="Reciepts"
      active="Reciepts"
      headerActions={
        <button
          onClick={() => setShowExportModal(true)}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
        >
          <Download size={18} />
          Export
        </button>
      }
    >
      <PageBanner
        title="Sales Receipts"
        subtitle="Track and manage all your sales transactions"
        icon={ReceiptText}
        gradient="from-teal-600 to-cyan-600"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard variant="simple" title="Total Sales" value={totalSales} />
        <StatCard
          variant="simple"
          title="Total Revenue"
          value={`${formatCurrency(totalSalesAmount)} Frw`}
        />
        <StatCard
          variant="simple"
          title="Average Sale"
          value={
            totalSales > 0
              ? formatCurrency(totalSalesAmount / totalSales) + " Frw"
              : "0"
          }
        />
        <StatCard
          variant="simple"
          title="Customers"
          value={new Set(sales.map((s) => s.clientName)).size}
        />
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-3 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by customer name or sale ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-slate-500">Loading sales...</p>
          </div>
        ) : filteredSales.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-500">
              No sales found. {searchTerm && "Try adjusting your search."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                    Sale ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                    Items
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredSales.map((sale) => {
                  const totalAmount =
                    sale.products?.reduce(
                      (sum, p) => sum + (p.totalPrice || 0),
                      0,
                    ) || 0;
                  const itemCount = sale.products?.length || 0;

                  return (
                    <React.Fragment key={sale._id}>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                          {sale.clientName || "Walk-in"}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          #{sale._id.substring(0, 8)}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {formatDateTime(sale.saleDate)}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {itemCount} item{itemCount !== 1 ? "s" : ""}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-900 text-right">
                          {formatCurrency(totalAmount)} Frw
                        </td>

                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() =>
                                setExpandedRow(
                                  expandedRow === sale._id
                                    ? null
                                    : sale._id,
                                )
                              }
                              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                              title="View details"
                            >
                              {expandedRow === sale._id ? (
                                <ChevronDown
                                  size={18}
                                  className="text-slate-600"
                                />
                              ) : (
                                <Eye size={18} className="text-slate-600" />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                try {
                                  printReceipt(sale, branch, user);
                                } catch (err) {
                                  toast.error(err.message);
                                }
                              }}
                              className="p-2 hover:bg-teal-100 rounded-lg transition-colors"
                              title="Print 80mm receipt"
                            >
                              <Printer
                                size={18}
                                className="text-teal-600"
                              />
                            </button>
                            <button
                              onClick={() => {
                                try {
                                  downloadReceiptPdf(sale, branch, user);
                                } catch (err) {
                                  toast.error(err.message);
                                }
                              }}
                              className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Save receipt as PDF"
                            >
                              <FileDown
                                size={18}
                                className="text-blue-600"
                              />
                            </button>
                            {user.role === "Boss" && (
                              <button
                                onClick={() => handleDeleteSale(sale._id)}
                                className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                title="Delete receipt"
                              >
                                <Trash2 size={18} className="text-red-600" />
                              </button>)}
                          </div>
                        </td>
                      </tr>
                      {expandedRow === sale._id && (
                        <tr className="bg-slate-50 border-t-2 border-slate-200">
                          <td colSpan="6" className="px-6 py-4">
                            <div className="space-y-4">
                              <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
                                  Items Sold
                                </p>
                                <div className="space-y-2">
                                  {sale.products?.map((product, idx) => (
                                    <div
                                      key={idx}
                                      className="flex justify-between items-start bg-white p-2 rounded border border-slate-200"
                                    >
                                      <div>
                                        <p className="text-sm font-medium text-slate-900">
                                          {product.productName}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                          Qty:{" "}
                                          {product.quantitySold ||
                                            product.quantity}{" "}
                                          ×{" "}
                                          {formatCurrency(
                                            product.unitPrice,
                                          )}
                                        </p>
                                      </div>
                                      <p className="text-sm font-semibold text-slate-900">
                                        {formatCurrency(product.totalPrice)}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                Export Sales
              </h2>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Export Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  Export Type
                </label>
                <div className="space-y-2">
                  <label
                    className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50"
                    style={{
                      borderColor:
                        exportOptions.type === "sale" ? "#2563eb" : undefined,
                      backgroundColor:
                        exportOptions.type === "sale" ? "#dbeafe" : undefined,
                    }}
                  >
                    <input
                      type="radio"
                      name="exportType"
                      value="sale"
                      checked={exportOptions.type === "sale"}
                      onChange={(e) =>
                        setExportOptions({
                          ...exportOptions,
                          type: e.target.value,
                        })
                      }
                      className="w-4 h-4"
                    />
                    <span className="font-medium text-slate-900">
                      Sales Receipts
                    </span>
                    <span className="text-xs text-slate-500 ml-auto">
                      Detailed sales data
                    </span>
                  </label>
                  <label
                    className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50"
                    style={{
                      borderColor:
                        exportOptions.type === "report"
                          ? "#2563eb"
                          : undefined,
                      backgroundColor:
                        exportOptions.type === "report"
                          ? "#dbeafe"
                          : undefined,
                    }}
                  >
                    <input
                      type="radio"
                      name="exportType"
                      value="report"
                      checked={exportOptions.type === "report"}
                      onChange={(e) =>
                        setExportOptions({
                          ...exportOptions,
                          type: e.target.value,
                        })
                      }
                      className="w-4 h-4"
                    />
                    <span className="font-medium text-slate-900">
                      Sales Report
                    </span>
                    <span className="text-xs text-slate-500 ml-auto">
                      Summary report
                    </span>
                  </label>
                </div>
              </div>

              {/* Time Period Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  Time Period
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "day", label: "Today" },
                    { value: "week", label: "This Week" },
                    { value: "month", label: "This Month" },
                    { value: "year", label: "This Year" },
                    { value: "all", label: "All Time" },
                  ].map((period) => (
                    <button
                      key={period.value}
                      onClick={() =>
                        setExportOptions({
                          ...exportOptions,
                          period: period.value,
                        })
                      }
                      className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                        exportOptions.period === period.value
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                      }`}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">
                    {getFilteredSalesByPeriod(filteredSales).length}
                  </span>{" "}
                  sales found for{" "}
                  <span className="font-semibold">
                    {exportOptions.period === "all"
                      ? "all time"
                      : exportOptions.period}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-slate-200">
              <button
                onClick={() => setShowExportModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 text-slate-900 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleExportPDF}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={showDeleteModal}
        variant="compact"
        title="Delete Sale Receipt"
        message="Are you sure you want to delete this sale receipt? This action cannot be undone."
        confirmText="Delete Sale"
        cancelText="Cancel"
        icon={Trash2}
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setDeleteConfirmId(null);
        }}
      >
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-800">
            <strong>Warning:</strong> Deleting this sale will remove all
            associated transaction records.
          </p>
        </div>
      </ConfirmModal>
    </DashboardLayout>
  );
};

export default Receipts;
