// components/PaymentMethodSelect.js
import React, { useState, useMemo } from "react";

export default function PaymentMethodSelect({
  paymentMethods,
  selectedPaymentMethod,
  onSelectPaymentMethod,
  includeAllOption = false,
}) {
  const [searchText, setSearchText] = useState("");

  const filteredPaymentMethods = useMemo(() => {
    if (!searchText) {
      return paymentMethods;
    }
    return paymentMethods.filter((method) =>
      method.title.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [paymentMethods, searchText]);

  return (
    <div className="relative">
      <input
        type="text"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        placeholder="Search or select payment method"
        value={searchText || selectedPaymentMethod}
        onChange={(e) => {
          setSearchText(e.target.value);
          onSelectPaymentMethod(""); // Clear selected value when searching
        }}
        onBlur={() => {
          if (!selectedPaymentMethod) {
            setSearchText("");
          }
        }}
      />
      {searchText && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
          {includeAllOption && (
            <li
              className="cursor-pointer select-none relative py-2 pl-3 pr-9 text-gray-900 hover:bg-gray-100"
              onClick={() => {
                onSelectPaymentMethod("");
                setSearchText("");
              }}
            >
              All
            </li>
          )}
          {filteredPaymentMethods.map((method) => (
            <li
              key={method._id} // Assuming your payment method objects have an _id
              className="cursor-pointer select-none relative py-2 pl-3 pr-9 text-gray-900 hover:bg-gray-100"
              onClick={() => {
                onSelectPaymentMethod(method.name); // Assuming payment method objects have a 'name' field
                setSearchText("");
              }}
            >
              {method.name}
            </li>
          ))}
          {filteredPaymentMethods.length === 0 && !includeAllOption && (
            <li className="relative py-2 pl-3 pr-9 text-gray-700">
              No payment methods found.
            </li>
          )}
          {/* Option to create new payment method can be handled in the parent modal/page */}
        </ul>
      )}
      {!searchText && selectedPaymentMethod && (
        <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 text-gray-700">
          {selectedPaymentMethod}
        </div>
      )}
    </div>
  );
}
