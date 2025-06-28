"use client";

import { useEffect, useState } from "react";
import { updateMonthlyBudget, getMonthlyBudget } from "../utils/api";

// EditMonthlyBudgetButton component
export default function EditMonthlyBudgetButton({ token }) {
  const [open, setOpen] = useState(false);
  const [budget, setBudget] = useState(0);
  const [currentBudget, setCurrentBudget] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCurrentBudget = async () => {
      if (token) {
        try {
          const res = await getMonthlyBudget(token);
          setCurrentBudget(res.totalMonthlyBudget || 0);
          setBudget(res.totalMonthlyBudget || 0);
        } catch (err) {
          setError("Failed to fetch current budget");
        }
      }
    };
    fetchCurrentBudget();
  }, [token]);

  const handleOpen = async () => {
    setSuccess(false);
    setError("");
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
    setBudget(0);
    setSuccess(false);
    setError("");
  };
  const handleChange = (e) => {
    setBudget(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await updateMonthlyBudget(token, Number(budget));
      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (err) {
      setError(err.message || "Failed to update budget");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <button
        className="flex items-center gap-1 bg-[#3d65ff] hover:bg-[#2746b6] text-white font-medium px-4 py-2 rounded-lg shadow-md transition-all duration-150 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d65ff]/40 cursor-pointer"
        onClick={handleOpen}
        type="button"
      >
        Edit Monthly Spend Limit
        <span className="ml-2 text-xs bg-white/80 text-[#3d65ff] px-2 py-0.5 rounded font-semibold border border-[#3d65ff]/30">
          ₹{currentBudget}
        </span>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-lg p-6 min-w-[320px] flex flex-col items-center">
            <h3 className="text-lg font-bold mb-2 text-[#3d65ff]">
              Set Monthly Spend Limit
            </h3>
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col items-center gap-3"
            >
              <input
                type="number"
                min="0"
                step="1"
                value={budget}
                onChange={handleChange}
                placeholder="Enter amount (₹)"
                className="border border-[#3d65ff]/30 focus:border-[#3d65ff] rounded-lg px-3 py-2 text-base text-[#1e2a47] bg-white outline-none shadow-sm w-full"
                required
              />
              <div className="flex gap-2 w-full justify-end">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-[#3d65ff] hover:bg-[#2746b6] text-white font-semibold"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
              {success && (
                <div className="text-green-600 text-sm mt-1">Saved!</div>
              )}
              {error && (
                <div className="text-red-500 text-sm mt-1">{error}</div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
