"use client";

import { useState, useEffect } from "react";
import ExpenseCard from "../../../components/ExpenseCard";
import ExpenseEditModal from "../../../components/ExpenseEditModal";
import ConfirmationModal from "../../../components/ConfirmationModal";
import FilterBar from "../../../components/FilterBar";
import SearchBar from "../../../components/SearchBar";
import Pagination from "../../../components/Pagination";
import ChartComponent from "../../../components/ChartComponent";
import AddNewExpenseButton from "../../../components/AddNewExpenseButton";
import EditMonthlyBudgetButton from "../../../components/EditMonthlyBudgetButton";
import {
  getExpenses,
  getAnalysisData,
  getCategories,
  getPaymentMethods,
  addExpense,
  updateExpense,
  deleteExpense,
  filterExpenses,
} from "../../../utils/api";
import { useAuth } from "../../../hooks/useAuth";

export default function DashboardPage() {
  const { token } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);
  // Date range for analysis
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const [analysisRange, setAnalysisRange] = useState({
    start: firstDayOfMonth.toISOString().slice(0, 10),
    end: lastDayOfMonth.toISOString().slice(0, 10),
  });
  const [categories, setCategories] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Combine filters, searchQuery, and currentPage into a single state object to avoid double renders
  const [queryState, setQueryState] = useState({
    currentPage: 1,
    filters: {},
    searchQuery: "",
  });
  const [totalPages, setTotalPages] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  // Fetch expenses with pagination, filters, and search
  const fetchExpenses = async (page, currentFilters, currentSearchQuery) => {
    setLoading(true);
    setError(null);
    try {
      const filter = {
        page: page,
        ...currentFilters,
        searchQuery: currentSearchQuery,
      };
      const data = await filterExpenses(token, filter);
      setExpenses(data.expenses || []);
      setTotalPages(data.pagination?.totalPages || data.totalPages || 1);
    } catch (err) {
      setError("Failed to fetch expenses.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to process API analysis data
  const processAnalysisData = (apiData) => {
    if (!Array.isArray(apiData)) return {};
    let totalSpentThisMonth = 0;
    const categoryTotals = {};
    const paymentTotals = {};
    const categorySpending = {};
    const spendingOverTime = [];
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    apiData.forEach((dayObj) => {
      let dayTotal = 0;
      (dayObj.expenses || []).forEach((exp) => {
        // Total spent this month
        const expDate = new Date(exp.date);
        if (
          expDate.getMonth() === thisMonth &&
          expDate.getFullYear() === thisYear
        ) {
          totalSpentThisMonth += exp.amount;
        }
        // Category totals
        const cat = exp.category?.title || "Unknown";
        categoryTotals[cat] = (categoryTotals[cat] || 0) + exp.amount;
        categorySpending[cat] = (categorySpending[cat] || 0) + exp.amount;
        // Payment method totals
        const pm = exp.paymentMethod?.title || "Unknown";
        paymentTotals[pm] = (paymentTotals[pm] || 0) + exp.amount;
        dayTotal += exp.amount;
      });
      // Spending over time (line chart)
      spendingOverTime.push({
        label: dayObj.day,
        value: dayTotal,
      });
    });

    // Top category
    let topCategory = null;
    let maxCat = 0;
    Object.entries(categoryTotals).forEach(([cat, amt]) => {
      if (amt > maxCat) {
        maxCat = amt;
        topCategory = cat;
      }
    });

    // Top 3 payment methods
    const topPaymentMethods = Object.entries(paymentTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([pm]) => pm);

    // Pie chart data
    const pieData = Object.entries(categorySpending).map(([cat, amt]) => ({
      label: cat,
      value: amt,
    }));

    // Line chart data
    const lineData = spendingOverTime;

    return {
      totalSpentThisMonth,
      topCategory,
      topPaymentMethods,
      categorySpending: pieData,
      spendingOverTime: lineData,
    };
  };

  // Fetch dashboard analysis data
  // Correct API usage: pass startDate and endDate as separate args
  const fetchAnalysisData = async (range = analysisRange) => {
    try {
      const data = await getAnalysisData(token, range.start, range.end);
      const arr = data.data || data;
      setAnalysisData(processAnalysisData(arr));
    } catch (err) {
      console.error("Failed to fetch analysis data:", err);
    }
  };

  // Fetch categories and payment methods
  const fetchCategoriesAndPaymentMethods = async () => {
    try {
      const categoriesData = await getCategories(token);
      setCategories(categoriesData.categories || categoriesData);
      const paymentMethodsData = await getPaymentMethods(token);
      setPaymentMethods(
        paymentMethodsData.paymentMethods || paymentMethodsData
      );
    } catch (err) {
      console.error("Failed to fetch categories or payment methods:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchExpenses(
        queryState.currentPage,
        queryState.filters,
        queryState.searchQuery
      );
      fetchCategoriesAndPaymentMethods();
    } else {
      console.log("Token not found, skipping fetchExpenses");
    }
  }, [token, queryState]);

  useEffect(() => {
    if (token) {
      fetchAnalysisData(analysisRange);
    }
    // eslint-disable-next-line
  }, [token, analysisRange]);
  // Handler for date range change
  const handleAnalysisRangeChange = (e) => {
    const { name, value } = e.target;
    setAnalysisRange((prev) => ({ ...prev, [name]: value }));
  };

  // useEffect(() => {
  //   if (token) {
  //     fetchExpenses(
  //       queryState.currentPage,
  //       queryState.filters,
  //       queryState.searchQuery
  //     );
  //   }
  //   // eslint-disable-next-line
  // }, [queryState, token]);

  const handleFilterChange = (newFilters) => {
    setQueryState((prev) => ({
      ...prev,
      filters: newFilters,
      currentPage: 1,
    }));
  };

  const handleSearch = (query) => {
    setQueryState((prev) => ({
      ...prev,
      searchQuery: query,
      currentPage: 1,
    }));
  };

  const handlePageChange = (page) => {
    setQueryState((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  const handleEditClick = (expense) => {
    setSelectedExpense(expense);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedExpense(null);
  };

  const handleSaveExpense = async (updatedExpense) => {
    try {
      if (updatedExpense._id) {
        await updateExpense(token, updatedExpense._id, updatedExpense);
      } else {
        await addExpense(token, updatedExpense);
      }
      fetchExpenses(
        queryState.currentPage,
        queryState.filters,
        queryState.searchQuery
      );
      fetchAnalysisData();
      handleCloseEditModal();
    } catch (err) {
      console.error("Failed to save expense:", err);
    }
  };

  const handleDeleteClick = (expenseId) => {
    setExpenseToDelete(expenseId);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteExpense(token, expenseToDelete);
      fetchExpenses(
        queryState.currentPage,
        queryState.filters,
        queryState.searchQuery
      );
      fetchAnalysisData();
      handleCloseConfirmModal();
    } catch (err) {
      console.error("Failed to delete expense:", err);
    }
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setExpenseToDelete(null);
  };

  const handleAddNewExpense = () => {
    setSelectedExpense(null);
    setIsEditModalOpen(true);
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
        <FilterBar
          filters={queryState.filters}
          onFilterChange={handleFilterChange}
          categories={categories}
          paymentMethods={paymentMethods}
        />
        <div className="flex items-center gap-2 flex-wrap w-full justify-between">
          <SearchBar onSearch={handleSearch} />
          <div className="flex items-center gap-2">
            <EditMonthlyBudgetButton token={token} />
            <AddNewExpenseButton onClick={handleAddNewExpense} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {
          console.log("Expenses:", expenses) // Debugging line to check expenses
        }
        {expenses.map((expense) => (
          <ExpenseCard
            key={expense._id}
            expense={expense}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
        ))}
      </div>
      <Pagination
        currentPage={queryState.currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      {analysisData && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-6 text-[#eeeff1]">Analysis</h2>
          {/* Analysis controls */}
          <div className="flex flex-wrap justify-end items-center gap-2 mb-4 p-2 bg-[#f5f8ff] rounded-xl shadow border border-[#3d65ff]/10">
            <span className="font-semibold text-[#3d65ff] mr-2 text-base">
              Analysis Range:
            </span>
            <input
              type="date"
              name="start"
              value={analysisRange.start}
              max={analysisRange.end}
              onChange={handleAnalysisRangeChange}
              className="border border-[#3d65ff]/30 focus:border-[#3d65ff] rounded-lg px-3 py-1.5 text-sm text-[#1e2a47] bg-white transition-colors duration-150 outline-none shadow-sm hover:border-[#3d65ff]"
            />
            <span className="mx-1 text-[#3d65ff] font-bold">to</span>
            <input
              type="date"
              name="end"
              value={analysisRange.end}
              min={analysisRange.start}
              onChange={handleAnalysisRangeChange}
              className="border border-[#3d65ff]/30 focus:border-[#3d65ff] rounded-lg px-3 py-1.5 text-sm text-[#1e2a47] bg-white transition-colors duration-150 outline-none shadow-sm hover:border-[#3d65ff]"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/95 border border-[#3d65ff]/10 rounded-2xl shadow-lg p-6 flex flex-col justify-center min-h-[200px]">
              <h3 className="text-lg font-semibold mb-3 text-[#3d65ff]">
                Monthly Summary
              </h3>
              <div className="space-y-2 text-[#1e2a47] text-base">
                <div className="flex items-center justify-between">
                  <span>Total Spent this Range:</span>
                  <span className="font-bold text-lg text-[#3d65ff]">
                    ₹{analysisData.totalSpentThisMonth || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Top Category:</span>
                  <span className="font-semibold">
                    {analysisData.topCategory || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Top 3 Payment Methods:</span>
                  <span className="font-semibold">
                    {analysisData.topPaymentMethods?.join(", ") || "N/A"}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white/95 border border-[#3d65ff]/10 rounded-2xl shadow-lg p-6 flex flex-col">
              <h3 className="text-lg font-semibold mb-3 text-[#3d65ff]">
                Category Spending
              </h3>
              <div className="flex-1 min-h-[220px]">
                {analysisData.categorySpending && (
                  <ChartComponent
                    type="pie"
                    data={analysisData.categorySpending}
                  />
                )}
              </div>
            </div>
            <div className="bg-white/95 border border-[#3d65ff]/10 rounded-2xl shadow-lg p-6 col-span-full flex flex-col">
              <h3 className="text-lg font-semibold mb-3 text-[#3d65ff]">
                Spending Over Time
              </h3>
              <div className="flex-1 min-h-[220px]">
                {analysisData.spendingOverTime && (
                  <ChartComponent
                    type="line"
                    data={analysisData.spendingOverTime}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {isEditModalOpen && (
        <ExpenseEditModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          expense={selectedExpense}
          categories={categories}
          paymentMethods={paymentMethods}
          onSave={handleSaveExpense}
          fetchCategoriesAndPaymentMethods={fetchCategoriesAndPaymentMethods}
        />
      )}
      {isConfirmModalOpen && (
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={handleCloseConfirmModal}
          onConfirm={handleConfirmDelete}
          message="Are you sure you want to delete this expense?"
        />
      )}
    </div>
  );
}
