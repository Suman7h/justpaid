"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const SearchBar = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
  const placeholders = [
    "Search by expertise (e.g., Accountant)",
    "Find financial experts near you",
    "Get tailored financial advice",
    "Search top-rated accountants",
  ];

  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [locationValue, setLocationValue] = useState("");
  const [searchHistory, setSearchHistory] = useState<
    Array<{ search: string; location: string }>
  >([]);
  const [searchError, setSearchError] = useState(false);
  const [locationError, setLocationError] = useState(false);

  useEffect(() => {
    if (inputValue) return;

    const interval = setInterval(() => {
      setCurrentPlaceholderIndex(
        (prevIndex) => (prevIndex + 1) % placeholders.length
      );
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [inputValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      
      const hasSearch = inputValue.trim() !== "";
      const hasLocation = locationValue.trim() !== "";

      if (!hasSearch) setSearchError(true);
      if (!hasLocation) setLocationError(true);

      if (hasSearch && hasLocation) {
        
        setSearchHistory((prev) => [
          ...prev,
          { search: inputValue.trim(), location: locationValue.trim() },
        ]);

        
        setInputValue("");
        setLocationValue("");

        
        setSearchError(false);
        setLocationError(false);
        console.log(searchHistory)
        const params=new URLSearchParams(searchParams);
        router.push(
            `/pages?search=${encodeURIComponent(inputValue)}&location=${encodeURIComponent(locationValue)}`
          );
      }
    }
  };

  return (
    <div className="relative flex w-full max-w-xl items-center border border-gray-300 rounded-full overflow-hidden">
      {/* Search Input */}
      <div className="flex-1 relative">
        <input
          type="text"
          className={`w-full p-4 rounded-l-full focus:outline-none focus:ring-2 ${
            searchError
              ? "border-red-500 ring-red-500"
              : "border-gray-300 focus:ring-gray-500"
          }`}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (searchError) setSearchError(false); 
          }}
          placeholder={""}
          onKeyDown={handleKeyDown}
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
          <AnimatePresence>
            {!inputValue && (
              <motion.span
                key={currentPlaceholderIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="block"
              >
                {placeholders[currentPlaceholderIndex]}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-gray-300"></div>

      {/* Location Input */}
      <div className="flex-shrink-0 w-36 relative">
        <input
          type="text"
          className={`w-full p-4 rounded-r-full focus:outline-none focus:ring-2 ${
            locationError
              ? "border-red-500 ring-red-500"
              : "border-gray-300 focus:ring-gray-500"
          }`}
          value={locationValue}
          onChange={(e) => {
            setLocationValue(e.target.value);
            if (locationError) setLocationError(false); 
          }}
          placeholder="Location"
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

export default SearchBar;
