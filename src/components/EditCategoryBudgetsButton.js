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
    setEditLimit(cat.limit ?? 0);
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
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={handleDropdownClick}
        type="button"
      >
        Edit Category Budgets
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded shadow-lg z-50">
          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">Loading...</div>
            ) : error ? (
              <div className="p-4 text-red-500 text-center">{error}</div>
            ) : categories.length === 0 ? (
              <div className="p-4 text-center">No categories found.</div>
            ) : (
              categories.map((cat) => (
                <div
                  key={cat._id || cat.id}
                  className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleEditClick(cat)}
                >
                  <span>{cat.title || cat.name}</span>
                  <span className="text-sm text-gray-500">
                    Limit: ₹{cat.limit ?? 0}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {selected && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">
              Edit Budget for {selected.title || selected.name}
            </h3>
            <input
              type="number"
              min={0}
              value={editLimit}
              onChange={(e) => setEditLimit(Number(e.target.value))}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setSelected(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
