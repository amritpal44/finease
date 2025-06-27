// components/CategorySelect.js
import React, { useState, useMemo } from "react";

export default function CategorySelect({
  categories,
  selectedCategory,
  onSelectCategory,
  includeAllOption = false,
}) {
  const [searchText, setSearchText] = useState("");

  const filteredCategories = useMemo(() => {
    if (!searchText) {
      return categories;
    }
    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [categories, searchText]);

  return (
    <div className="relative">
      <input
        type="text"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        placeholder="Search or select category"
        value={searchText || selectedCategory} // Show selected value or search text
        onChange={(e) => {
          setSearchText(e.target.value);
          onSelectCategory(""); // Clear selected category when searching
        }}
        onBlur={() => {
          // If no category is selected after blur, clear search text
          if (!selectedCategory) {
            setSearchText("");
          }
        }}
      />
      {searchText && ( // Show dropdown only when searching
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
          {includeAllOption && (
            <li
              className="cursor-pointer select-none relative py-2 pl-3 pr-9 text-gray-900 hover:bg-gray-100"
              onClick={() => {
                onSelectCategory("");
                setSearchText("");
              }}
            >
              All
            </li>
          )}
          {filteredCategories.map((category) => (
            <li
              key={category._id} // Assuming your category objects have an _id
              className="cursor-pointer select-none relative py-2 pl-3 pr-9 text-gray-900 hover:bg-gray-100"
              onClick={() => {
                onSelectCategory(category.name); // Assuming category objects have a 'name' field
                setSearchText(""); // Clear search text on selection
              }}
            >
              {category.name}
            </li>
          ))}
          {filteredCategories.length === 0 && !includeAllOption && (
            <li className="relative py-2 pl-3 pr-9 text-gray-700">
              No categories found.
            </li>
          )}
          {/* Option to create new category can be handled in the parent modal/page */}
        </ul>
      )}
      {!searchText &&
        selectedCategory && ( // Show selected category if no search text
          <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 text-gray-700">
            {selectedCategory}
          </div>
        )}
    </div>
  );
}
