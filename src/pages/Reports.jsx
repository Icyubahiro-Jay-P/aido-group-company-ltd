import React, { useState, useEffect } from "react";
import {
  DollarSign,
  AlertTriangle,
  Package,
  ReceiptText,
  TrendingUp,
  User,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import PageBanner from "../components/PageBanner";
import StatCard from "../components/StatCard";
import Badge from "../components/Badge";
import {
  getDailyIncome,
  getWeeklyIncome,
  getMonthlyIncome,
  getAnnualIncome,
  getDailyExpense,
  getWeeklyExpense,
  getMonthlyExpense,
  getAnnualExpense,
  getDailyProfit,
  getWeeklyProfit,
  getMonthlyProfit,
  getAnnualProfit,
  getDailyLoss,
  getWeeklyLoss,
  getMonthlyLoss,
  getAnnualLoss,
  getDailyClients,
  getWeeklyClients,
  getInventorySummary,
  getLowStockItems,
  getRecentTransactions,
} from "../api/reportServices";
import { toast } from "sonner";
import Loading from "../components/Loading";

const Reports = () => {
  const { user } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState("daily"); // daily, weekly, monthly, annual

  // Core metrics
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [profit, setProfit] = useState(0);
  const [loss, setLoss] = useState(0);
  const [clients, setClients] = useState(0);

  // Details
  const [lowStockItems, setLowStockItems] = useState([]);
  const [inventorySummary, setInventorySummary] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const formatCurrency = (amount) => {
    return (amount || 0).toLocaleString("en-US");
  };

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Fetch data based on selected time period
      let incomeData = 0;
      let expenseData = 0;
      let profitData = 0;
      let lossData = 0;
      let clientData = 0;

      if (timePeriod === "daily") {
        const [incRes, expRes, profRes, lossRes, clientRes] = await Promise.all(
          [
            getDailyIncome(),
            getDailyExpense(),
            getDailyProfit(),
            getDailyLoss(),
            getDailyClients(),
          ],
        );
        incomeData = incRes?.data || 0;
        expenseData = expRes?.data || 0;
        profitData = profRes?.data || 0;
        lossData = lossRes?.data || 0;
        clientData = clientRes?.data || 0;
      } else if (timePeriod === "weekly") {
        const [incRes, expRes, profRes, lossRes, clientRes] = await Promise.all(
          [
            getWeeklyIncome(),
            getWeeklyExpense(),
            getWeeklyProfit(),
            getWeeklyLoss(),
            getWeeklyClients(),
          ],
        );
        incomeData = incRes?.data || 0;
        expenseData = expRes?.data || 0;
        profitData = profRes?.data || 0;
        lossData = lossRes?.data || 0;
        clientData = clientRes?.data || 0;
      } else if (timePeriod === "monthly") {
        const [incRes, expRes, profRes, lossRes, clientRes] = await Promise.all(
          [
            getMonthlyIncome(),
            getMonthlyExpense(),
            getMonthlyProfit(),
            getMonthlyLoss(),
            getWeeklyClients(),
          ],
        );
        incomeData = incRes?.data || 0;
        expenseData = expRes?.data || 0;
        profitData = profRes?.data || 0;
        lossData = lossRes?.data || 0;
        clientData = clientRes?.data || 0;
      } else if (timePeriod === "annual") {
        const [incRes, expRes, profRes, lossRes, clientRes] = await Promise.all(
          [
            getAnnualIncome(),
            getAnnualExpense(),
            getAnnualProfit(),
            getAnnualLoss(),
            getDailyClients(),
          ],
        );
        incomeData = incRes?.data || 0;
        expenseData = expRes?.data || 0;
        profitData = profRes?.data || 0;
        lossData = lossRes?.data || 0;
        clientData = clientRes?.data || 0;
      }

      setIncome(incomeData);
      setExpense(expenseData);
      setProfit(profitData);
      setLoss(lossData);
      setClients(clientData);

      // Fetch static data (not time-dependent)
      const [lowRes, invRes, transRes] = await Promise.all([
        getLowStockItems(10),
        getInventorySummary(),
        getRecentTransactions(),
      ]);

      // Process low stock - handle both direct array and wrapped response
      if (Array.isArray(lowRes)) {
        setLowStockItems(lowRes);
      } else if (lowRes?.data && Array.isArray(lowRes.data)) {
        setLowStockItems(lowRes.data);
      } else {
        setLowStockItems([]);
      }

      // Process inventory - getInventorySummary returns data directly
      if (invRes && typeof invRes === "object") {
        setInventorySummary(invRes?.data || invRes);
      }

      // Process recent transactions
      if (transRes?.data && Array.isArray(transRes.data)) {
        setRecentTransactions(transRes.data.slice(0, 8));
      } else if (Array.isArray(transRes)) {
        setRecentTransactions(transRes.slice(0, 8));
      }
    } catch (error) {
      toast.error(error.message || "Failed to load reports. Please try again.");
      console.error("Report fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "AIDO Group Company Ltd - Reports";
    fetchReportData();
  }, [timePeriod]);

  return (
    <DashboardLayout title="Business Analytics" brand="Reports" active="Reports">
      <PageBanner
        title="Business Analytics"
        subtitle="Complete overview of your business performance and metrics."
        icon={TrendingUp}
        gradient="from-indigo-600 to-blue-600"
      >
        <div className="mt-6 flex gap-2 flex-wrap">
          {["daily", "weekly", "monthly", "annual"].map((period) => (
            <button
              key={period}
              onClick={() => setTimePeriod(period)}
              className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                timePeriod === period
                  ? "bg-white text-indigo-600 shadow-lg"
                  : "bg-white/20 backdrop-blur text-white border border-white/30 hover:bg-white/30"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </PageBanner>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <Loading />
        </div>
      ) : (
        <>
          {/* Main KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Total Revenue"
              value={`${formatCurrency(income)} Frw`}
              icon={DollarSign}
              iconBg="bg-green-100"
              iconColor="text-green-600"
            />
            <StatCard
              title="Total Profit"
              value={`${formatCurrency(profit)} Frw`}
              icon={TrendingUp}
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
            />
            <StatCard
              title="Active Clients"
              value={clients || 0}
              icon={User}
              iconBg="bg-purple-100"
              iconColor="text-purple-600"
            />
          </div>

          {/* Secondary Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Total Loss"
              value={`${formatCurrency(loss)} Frw`}
              icon={AlertTriangle}
              iconBg="bg-orange-100"
              iconColor="text-orange-600"
            />
            <StatCard
              title="Inventory Value"
              value={`${formatCurrency(
                inventorySummary?.totalStockValueAtSalePrice || 0,
              )} Frw`}
              icon={Package}
              iconBg="bg-indigo-100"
              iconColor="text-indigo-600"
            />
            <StatCard
              title="Low Stock Items"
              value={lowStockItems.length}
              icon={AlertTriangle}
              iconBg="bg-red-100"
              iconColor="text-red-600"
            />
          </div>

          <div className="grid grid-cols-1 gap-8 mb-8">
            {/* Low Stock Items */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Low Stock Alert ({lowStockItems.length})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3">Product</th>
                      <th className="px-6 py-3 text-right">
                        Current Stock
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {lowStockItems.length > 0 ? (
                      lowStockItems.slice(0, 6).map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="px-6 py-4 font-medium text-slate-900">
                            {item.productName || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-red-600 font-bold">
                              {item.quantity || 0}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="2"
                          className="px-6 py-4 text-center text-slate-500"
                        >
                          No low stock items
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <ReceiptText className="w-5 h-5 text-blue-500" />
                Recent Transactions
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3 text-right">Amount</th>
                    <th className="px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentTransactions.length > 0 ? (
                    recentTransactions.map((transaction, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <Badge
                            variant={transaction.type === "income" ? "green" : "red"}
                            className="px-2 py-1"
                          >
                            {transaction.type || "N/A"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {transaction.description || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-slate-900">
                          {formatCurrency(transaction.amount || 0)} Frw
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {transaction.date
                            ? new Date(transaction.date).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric" },
                              )
                            : "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-center text-slate-500"
                      >
                        No transaction data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Reports;
