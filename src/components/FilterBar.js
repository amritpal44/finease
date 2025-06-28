// components/FilterBar.js
import React, { useState } from "react";

export default function FilterBar({
  filters = {},
  onFilterChange,
  categories,
  paymentMethods,
}) {
  const [startDateInput, setStartDateInput] = useState(filters.startDate || "");
  const [endDateInput, setEndDateInput] = useState(filters.endDate || "");

  const handleCategoryChange = (e) => {
    onFilterChange({ ...filters, category: e.target.value });
  };
  const clearCategory = () => {
    onFilterChange({ ...filters, category: "" });
  };
  const handlePaymentMethodChange = (e) => {
    onFilterChange({ ...filters, paymentMethod: e.target.value });
  };
  const clearPaymentMethod = () => {
    onFilterChange({ ...filters, paymentMethod: "" });
  };

  // Only update filter when user finishes typing (onBlur or full date entered)
  const handleStartDateChange = (e) => {
    setStartDateInput(e.target.value);
    if (e.target.value.length === 10) {
      onFilterChange({ ...filters, startDate: e.target.value });
    }
    // If startDate is cleared, also clear endDate
    if (!e.target.value) {
      setEndDateInput("");
      onFilterChange({ ...filters, startDate: "", endDate: "" });
    }
  };
  const handleStartDateBlur = (e) => {
    if (e.target.value !== filters.startDate) {
      onFilterChange({ ...filters, startDate: e.target.value });
    }
  };
  const clearStartDate = () => {
    setStartDateInput("");
    setEndDateInput("");
    onFilterChange({ ...filters, startDate: "", endDate: "" });
  };
  const handleEndDateChange = (e) => {
    setEndDateInput(e.target.value);
    if (e.target.value.length === 10) {
      onFilterChange({ ...filters, endDate: e.target.value });
    }
  };
  const handleEndDateBlur = (e) => {
    if (e.target.value !== filters.endDate) {
      onFilterChange({ ...filters, endDate: e.target.value });
    }
  };
  const clearEndDate = () => {
    setEndDateInput("");
    onFilterChange({ ...filters, endDate: "" });
  };

  return (
    <div className="flex flex-wrap gap-6 items-end bg-white/90 border border-[#3d65ff]/10 rounded-xl shadow-md px-6 py-4 mb-2 w-full">
      <div className="min-w-[180px] flex-1">
        <label
          htmlFor="category-filter"
          className="block text-xs font-semibold text-[#3d65ff] mb-1"
        >
          Category
        </label>
        <div className="flex items-center gap-1">
          <select
            id="category-filter"
            className="w-full px-3 py-2 rounded-lg border border-[#3d65ff]/20 shadow focus:border-[#3d65ff] focus:ring-2 focus:ring-[#3d65ff]/10 text-[#1e2a47] text-sm"
            value={filters.category || ""}
            onChange={handleCategoryChange}
          >
            <option value="">All</option>
            {categories &&
              categories.map((cat) => (
                <option
                  key={cat._id || cat.id || cat}
                  value={cat._id || cat.id || cat}
                >
                  {cat.title || cat}
                </option>
              ))}
          </select>
          {filters.category && (
            <button
              type="button"
              onClick={clearCategory}
              className="ml-0.5 text-[#3d65ff] hover:text-red-500 text-base font-bold bg-white/90 border border-[#3d65ff]/20 rounded-full w-6 h-6 flex items-center justify-center shadow-sm transition-colors duration-150"
              aria-label="Clear category filter"
              style={{ minWidth: 24, minHeight: 24 }}
            >
              ×
            </button>
          )}
        </div>
      </div>
      <div className="min-w-[180px] flex-1">
        <label
          htmlFor="payment-method-filter"
          className="block text-xs font-semibold text-[#3d65ff] mb-1"
        >
          Payment Method
        </label>
        <div className="flex items-center gap-1">
          <select
            id="payment-method-filter"
            className="w-full px-3 py-2 rounded-lg border border-[#3d65ff]/20 shadow focus:border-[#3d65ff] focus:ring-2 focus:ring-[#3d65ff]/10 text-[#1e2a47] text-sm"
            value={filters.paymentMethod || ""}
            onChange={handlePaymentMethodChange}
          >
            <option value="">All</option>
            {paymentMethods &&
              paymentMethods.map((pm) => (
                <option
                  key={pm._id || pm.id || pm}
                  value={pm._id || pm.id || pm}
                >
                  {pm.title || pm}
                </option>
              ))}
          </select>
          {filters.paymentMethod && (
            <button
              type="button"
              onClick={clearPaymentMethod}
              className="ml-0.5 text-[#3d65ff] hover:text-red-500 text-base font-bold bg-white/90 border border-[#3d65ff]/20 rounded-full w-6 h-6 flex items-center justify-center shadow-sm transition-colors duration-150"
              aria-label="Clear payment method filter"
              style={{ minWidth: 24, minHeight: 24 }}
            >
              ×
            </button>
          )}
        </div>
      </div>
      <div className="min-w-[140px]">
        <label
          htmlFor="start-date-filter"
          className="block text-xs font-semibold text-[#3d65ff] mb-1"
        >
          Start Date
        </label>
        <div className="flex items-center gap-1">
          <input
            type="date"
            id="start-date-filter"
            className="w-full px-3 py-2 rounded-lg border border-[#3d65ff]/20 shadow focus:border-[#3d65ff] focus:ring-2 focus:ring-[#3d65ff]/10 text-[#1e2a47] text-sm"
            value={startDateInput}
            onChange={handleStartDateChange}
            onBlur={handleStartDateBlur}
            placeholder="yyyy-mm-dd"
            max={endDateInput || undefined}
          />
          {startDateInput && (
            <button
              type="button"
              onClick={clearStartDate}
              className="ml-0.5 text-[#3d65ff] hover:text-red-500 text-base font-bold bg-white/90 border border-[#3d65ff]/20 rounded-full w-6 h-6 flex items-center justify-center shadow-sm transition-colors duration-150"
              aria-label="Clear start date filter"
              style={{ minWidth: 24, minHeight: 24 }}
            >
              ×
            </button>
          )}
        </div>
      </div>
      <div className="min-w-[140px]">
        <label
          htmlFor="end-date-filter"
          className="block text-xs font-semibold text-[#3d65ff] mb-1"
        >
          End Date
        </label>
        <div className="flex items-center gap-1">
          <input
            type="date"
            id="end-date-filter"
            className="w-full px-3 py-2 rounded-lg border border-[#3d65ff]/20 shadow focus:border-[#3d65ff] focus:ring-2 focus:ring-[#3d65ff]/10 text-[#1e2a47] text-sm"
            value={endDateInput}
            onChange={handleEndDateChange}
            onBlur={handleEndDateBlur}
            placeholder="yyyy-mm-dd"
            min={startDateInput ? startDateInput : undefined}
            disabled={!startDateInput}
            title={
              !startDateInput
                ? "Please select a start date first (yyyy-mm-dd)"
                : ""
            }
          />
          {endDateInput && (
            <button
              type="button"
              onClick={clearEndDate}
              className="ml-0.5 text-[#3d65ff] hover:text-red-500 text-base font-bold bg-white/90 border border-[#3d65ff]/20 rounded-full w-6 h-6 flex items-center justify-center shadow-sm transition-colors duration-150"
              aria-label="Clear end date filter"
              style={{ minWidth: 24, minHeight: 24 }}
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
