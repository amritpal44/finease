// components/SearchBar.js
import React, { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearchClick = () => {
    onSearch(query);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  return (
    <div className="flex items-center w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden border border-[#3d65ff]/20">
      <input
        type="text"
        placeholder="Search expenses..."
        className="flex-1 px-4 py-2 text-[#1e2a47] bg-transparent focus:outline-none focus:ring-0 placeholder:text-[#3d65ff]/60 text-base"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
      />
      <button
        onClick={handleSearchClick}
        className="bg-[#3d65ff] hover:bg-[#2746b6] cursor-pointer text-white font-semibold px-6 py-2 rounded-none rounded-r-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#3d65ff]/30"
      >
        Search
      </button>
    </div>
  );
}
