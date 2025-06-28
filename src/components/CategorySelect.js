// components/CategorySelect.js
import React, { useState, useMemo } from "react";

export default function CategorySelect({
  categories,
  selectedCategory,
  onSelectCategory,
  includeAllOption = false,
  onCreateNewCategory,
}) {
  const [searchText, setSearchText] = useState("");

  const filteredCategories = useMemo(() => {
    if (!searchText) {
      return categories;
    }
    return categories.filter((category) =>
      category.title.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [categories, searchText]);

  return (
    <div className="relative">
      <input
        type="text"
        className="mt-1 block w-full rounded-lg border border-[#3d65ff]/30 bg-white px-4 py-2 shadow-md focus:border-[#3d65ff] focus:ring-2 focus:ring-[#3d65ff]/20 text-[#1e2a47] placeholder:text-[#3d65ff]/60 transition-all duration-150"
        placeholder="Search or select category"
        value={
          searchText ||
          categories.find((cat) => cat._id === selectedCategory)?.title ||
          selectedCategory
        }
        onChange={(e) => {
          setSearchText(e.target.value);
          onSelectCategory("");
        }}
        // onBlur={() => {
        //   if (!selectedCategory) {
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
                onSelectCategory(category._id);
                setSearchText("");
              }}
            >
              All
            </li>
          )}
          {filteredCategories.map((category, idx) => (
            <li
              key={category._id || idx}
              className="cursor-pointer select-none py-2 px-4 text-[#1e2a47] hover:bg-[#eaf0ff] border-b last:border-b-0 border-[#3d65ff]/10"
              onClick={() => {
                onSelectCategory(category._id);
                setSearchText("");
              }}
            >
              {category.title}
            </li>
          ))}
          {filteredCategories.length === 0 && !includeAllOption && (
            <>
              <li className="py-2 px-4 text-gray-400">No categories found.</li>
              {searchText && (
                <li
                  className="cursor-pointer select-none py-2 px-4 text-[#3d65ff] hover:bg-[#eaf0ff] border-t border-[#3d65ff]/10 font-semibold"
                  onClick={() => onCreateNewCategory(searchText)}
                >
                  + Create new Category "{searchText}"
                </li>
              )}
            </>
          )}
        </ul>
      )}
      {!searchText && selectedCategory && (
        <div className="mt-1 block w-full rounded-lg border border-[#3d65ff]/20 shadow p-2 bg-[#eaf0ff] text-[#3d65ff] font-semibold text-center">
          Category Selected: "
          {categories.find((cat) => cat._id === selectedCategory)?.title ||
            selectedCategory}
          "
        </div>
      )}
    </div>
  );
}
