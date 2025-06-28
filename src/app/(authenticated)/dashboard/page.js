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
      const data = await filterExpenses(
        token
      );
      setExpenses(data.expenses || []);
      setTotalPages(data.pagination?.totalPages || data.totalPages || 1);
    } catch (err) {
      setError("Failed to fetch expenses.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch dashboard analysis data
  const fetchAnalysisData = async () => {
    try {
      const data = await getAnalysisData(token);
      setAnalysisData(data.data || data); // Support both {data: ...} and direct
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

  useEffect( () => {
    if (token) {
      fetchExpenses(token);
      fetchCategoriesAndPaymentMethods()
    }
    else {
      console.log("Token not found, skipping fetchExpenses");
    }
  }, [token]);

  // useEffect(() => {
  //   if (token) {
  //     fetchAnalysisData();
  //     fetchCategoriesAndPaymentMethods();
  //   }
  //   // eslint-disable-next-line
  // }, [token]);

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
      // fetchAnalysisData();
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

      <div className="flex justify-between items-center mb-4">
        {/* <FilterBar
          onFilterChange={handleFilterChange}
          categories={categories}
          paymentMethods={paymentMethods}
        />
        <SearchBar onSearch={handleSearch} /> */}
        <AddNewExpenseButton onClick={handleAddNewExpense} />
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
{/* 
      {analysisData && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-2">Monthly Summary</h3>
              <p>
                Total Spent this Month: ₹{analysisData.totalSpentThisMonth || 0}
              </p>
              <p>Top Category: {analysisData.topCategory?.title || "N/A"}</p>{" "}
              <p>
                Top 3 Payment Methods:{" "}
                {(analysisData.topPaymentMethods || []).join(", ")}
              </p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-2">Category Spending</h3>
              {analysisData.categorySpending && (
                <ChartComponent
                  type="pie"
                  data={analysisData.categorySpending}
                />
              )}
            </div>
            <div className="bg-white p-4 rounded shadow col-span-full">
              <h3 className="text-lg font-semibold mb-2">Spending Over Time</h3>
              {analysisData.spendingOverTime && (
                <ChartComponent
                  type="line"
                  data={analysisData.spendingOverTime}
                />
              )}
            </div>
          </div>
        </div>
      )}
      */}

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

    {/*  
      {isConfirmModalOpen && (
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={handleCloseConfirmModal}
          onConfirm={handleConfirmDelete}
          message="Are you sure you want to delete this expense?"
        />
      )} 
    */}


    </div>
  );
}
