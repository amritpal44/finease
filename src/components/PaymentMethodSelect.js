// components/PaymentMethodSelect.js
import React, { useState, useMemo } from "react";

export default function PaymentMethodSelect({
  paymentMethods,
  selectedPaymentMethod,
  onSelectPaymentMethod,
  includeAllOption = false,
  onCreateNewPaymentMethod,
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
        className="mt-1 block w-full rounded-lg border border-[#3d65ff]/30 bg-white px-4 py-2 shadow-md focus:border-[#3d65ff] focus:ring-2 focus:ring-[#3d65ff]/20 text-[#1e2a47] placeholder:text-[#3d65ff]/60 transition-all duration-150"
        placeholder="Search or select payment method"
        value={
          searchText ||
          paymentMethods.find((method) => method._id === selectedPaymentMethod)
            ?.title ||
          selectedPaymentMethod
        }
        onChange={(e) => {
          setSearchText(e.target.value);
          onSelectPaymentMethod("");
        }}
        // onBlur={() => {
        //   if (!selectedPaymentMethod) {
        //     setSearchText("");
        //   }
        // }}
      />
      {searchText && (
        <ul className="absolute z-20 w-full bg-white border border-[#3d65ff]/20 rounded-lg shadow-xl mt-1 max-h-60 overflow-auto animate-fade-in">
          {includeAllOption && (
            <li
              className="cursor-pointer select-none py-2 px-4 text-[#3d65ff] hover:bg-[#eaf0ff] rounded-t-lg"
              onClick={() => {
                onSelectPaymentMethod(method._id);
                setSearchText("");
              }}
            >
              All
            </li>
          )}
          {filteredPaymentMethods.map((method, idx) => (
            <li
              key={method._id || idx}
              className="cursor-pointer select-none py-2 px-4 text-[#1e2a47] hover:bg-[#eaf0ff] border-b last:border-b-0 border-[#3d65ff]/10"
              onClick={() => {
                onSelectPaymentMethod(method._id);
                setSearchText("");
              }}
            >
              {method.title}
            </li>
          ))}
          {filteredPaymentMethods.length === 0 && !includeAllOption && (
            <>
              <li className="py-2 px-4 text-gray-800">
                No payment methods found.
              </li>
              {searchText && (
                <li
                  className="cursor-pointer select-none py-2 px-4 text-[#3d65ff] hover:bg-[#eaf0ff] border-t border-[#3d65ff]/10 font-semibold"
                  onClick={() => onCreateNewPaymentMethod(searchText)}
                >
                  + Create new Payment Method "{searchText}"
                </li>
              )}
            </>
          )}
        </ul>
      )}
      {!searchText && selectedPaymentMethod && (
        <div className="mt-1 block w-full rounded-lg border border-[#3d65ff]/20 shadow p-2 bg-[#eaf0ff] text-[#3d65ff] font-semibold text-center">
          Payment Method Selected: "
          {paymentMethods.find((method) => method._id === selectedPaymentMethod)
            ?.title || selectedPaymentMethod}"
        </div>
      )}
    </div>
  );
}
