// components/FilterBar.js
import React, { useState, useEffect } from "react";
import CategorySelect from "./CategorySelect";
import PaymentMethodSelect from "./PaymentMethodSelect";

export default function FilterBar({
  onFilterChange,
  categories,
  paymentMethods,
}) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    // Apply filters whenever selected values change
    const filters = {};
    if (selectedCategory) filters.category = selectedCategory;
    if (selectedPaymentMethod) filters.paymentMethod = selectedPaymentMethod;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    onFilterChange(filters);
  }, [
    selectedCategory,
    selectedPaymentMethod,
    startDate,
    endDate,
    onFilterChange,
  ]); // Include onFilterChange in dependencies

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div>
        <label
          htmlFor="category-filter"
          className="block text-sm font-medium text-gray-700"
        >
          Category:
        </label>
        <CategorySelect
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          includeAllOption={true} // Add an "All" option
        />
      </div>
      <div>
        <label
          htmlFor="payment-method-filter"
          className="block text-sm font-medium text-gray-700"
        >
          Payment Method:
        </label>
        <PaymentMethodSelect
          paymentMethods={paymentMethods}
          selectedPaymentMethod={selectedPaymentMethod}
          onSelectPaymentMethod={setSelectedPaymentMethod}
          includeAllOption={true} // Add an "All" option
        />
      </div>
      <div>
        <label
          htmlFor="start-date-filter"
          className="block text-sm font-medium text-gray-700"
        >
          Start Date:
        </label>
        <input
          type="date"
          id="start-date-filter"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div>
        <label
          htmlFor="end-date-filter"
          className="block text-sm font-medium text-gray-700"
        >
          End Date:
        </label>
        <input
          type="date"
          id="end-date-filter"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
    </div>
  );
}
