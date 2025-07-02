import { useState, useEffect } from "react";
import { getUserCategoryBudgets, setCategoryBudget } from "../utils/api";

export default function EditCategoryBudgetsButton({ token }) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editLimit, setEditLimit] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch user's category budgets
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      // getUserCategoryBudgets fetches from /categories/user-expense-categories
      const data = await getUserCategoryBudgets(token);
      setCategories(data.categories || []);
    } catch (err) {
      setError("Failed to fetch category budgets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && token) fetchCategories();
    // eslint-disable-next-line
  }, [open, token]);

  const handleDropdownClick = () => {
    setOpen((prev) => !prev);
    setSuccess(null);
    setError(null);
  };

  const handleEditClick = (cat) => {
    setSelected(cat);
    setEditLimit(cat.limit === -1 ? 0 : cat.limit ?? 0);
  };

  const handleSave = async () => {
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      await setCategoryBudget(token, selected._id || selected.id, editLimit);
      setSuccess("Budget updated!");
      setSelected(null);
      fetchCategories();
    } catch (err) {
      setError("Failed to update budget.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition"
        onClick={handleDropdownClick}
        type="button"
      >
        Edit Category Budgets
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="max-h-60 overflow-y-auto divide-y divide-gray-100">
            {loading ? (
              <div className="p-4 text-center text-gray-700">Loading...</div>
            ) : error ? (
              <div className="p-4 text-red-500 text-center">{error}</div>
            ) : categories.length === 0 ? (
              <div className="p-4 text-center text-gray-700">
                No categories found.
              </div>
            ) : (
              categories.map((cat) => (
                <div
                  key={cat._id || cat.id}
                  className="flex items-center justify-between px-4 py-2 hover:bg-blue-50/80 transition cursor-pointer"
                  onClick={() => handleEditClick(cat)}
                >
                  <span className="font-medium text-gray-800">
                    {cat.title || cat.name}
                  </span>
                  <span
                    className={`text-xs rounded px-2 py-0.5 ml-2 ${
                      cat.limit === -1
                        ? "bg-gray-200 text-gray-500"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {cat.limit === -1 ? "No limit set" : `Limit: ₹${cat.limit}`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {selected && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
          <div className="bg-white/95 rounded-2xl shadow-2xl p-7 w-80 border border-blue-100 relative animate-fade-in">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold focus:outline-none"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-lg font-semibold mb-4 text-blue-700">
              Edit Budget for {selected.title || selected.name}
            </h3>
            <input
              type="number"
              min={0}
              value={editLimit}
              onChange={(e) => setEditLimit(Number(e.target.value))}
              className="w-full border border-blue-200 focus:border-blue-500 rounded-lg px-3 py-2 mb-4 text-gray-800 bg-blue-50/60 outline-none transition"
            />
            <div className="flex justify-end gap-2">
              <button
                className="cursor-pointer px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700"
                onClick={() => setSelected(null)}
              >
                Cancel
              </button>
              <button
                className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow"
                onClick={handleSave}
                disabled={loading}
              >
                Save
              </button>
            </div>
            {success && (
              <div className="text-green-600 mt-2 text-center">{success}</div>
            )}
            {error && (
              <div className="text-red-500 mt-2 text-center">{error}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
