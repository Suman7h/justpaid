"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";

interface CardsCarouselProps {
  searchQuery: string;
  locationQuery: string;
}

interface ExpertCardData {
  expertId: number;
  name: string;
  price: number;
  rating: number;
  reviewHighlight: string;
  reviewCount: number;
}

export function CardsCarousel({ searchQuery, locationQuery }: CardsCarouselProps) {
  const [sortOption, setSortOption] = useState<number | null>(null);
  const [currentSearchQuery, setCurrentSearchQuery] = useState(searchQuery);
  const [currentLocationQuery, setCurrentLocationQuery] = useState(locationQuery);
  const [filteredData, setFilteredData] = useState<ExpertCardData[]>([]);
  const [data1,  setData] = useState<ExpertCardData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value ? parseInt(e.target.value, 10) : null;
    setSortOption(selectedValue);
    
  };

  
  useEffect(() => {
    setCurrentSearchQuery(searchQuery);
    setCurrentLocationQuery(locationQuery);
  }, [searchQuery, locationQuery]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `http://localhost:8000/search/?searchQuery=${encodeURIComponent(currentSearchQuery)}&locationQuery=${encodeURIComponent(
            currentLocationQuery
          )}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch experts.");
        }

        const result = await response.json();
        setData(result); 
        setFilteredData(result);
      } catch (err: any) {
        console.error("Error fetching experts:", err.message);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentSearchQuery, currentLocationQuery]);

  useEffect(() => {
    if (sortOption === null) {
      
      setFilteredData(data1);
    } else {
      let filtered;
  
      if (sortOption === 5) {
        filtered = data1.filter((item) => item.rating >= 4.5);
      } else if (sortOption === 4) {
        filtered = data1.filter((item) => item.rating >= 4);
      } else if (sortOption === 3 || sortOption === 2 || sortOption === 1) {
        filtered = data1.filter((item) => item.rating < 4);
      } else {
        filtered = data1;
      }
  
      setFilteredData(filtered);
    }
  }, [sortOption, data1]);
  


  const capitalizedSearchQuery = capitalizeWords(currentSearchQuery);
  const capitalizedLocationQuery = capitalizeWords(currentLocationQuery);

  return (
    <main className="relative w-full">
      <div className=" mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl md:text-3xl font-bold">
            All {capitalizedSearchQuery} Experts Near {capitalizedLocationQuery}
          </h2>
          <div className="relative w-56">
              <select
                value={sortOption || ""}
                onChange={handleSortChange}
                className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-lg shadow-md leading-tight focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value="">Sort by Rating</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        <p className="text-lg font-medium text-gray-500 mb-2"></p>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredData.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105"
              style={{ width: "100%", maxWidth: "500px", height: "auto" }}
            >
              {/* Card Content */}
              <div className="flex items-center gap-4 p-4">
                <Image
                  src={"https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=3556&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="font-bold text-lg ">{item.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <span className="font-medium">{item.rating > 4.5 ? `Exceptional ${item.rating}` : `Good ${item.rating}`}</span>
                    <span>⭐ ({item.reviewCount})</span>
                  </div>
                </div>
              </div>

              <div className="px-4 pb-4">
                <p className="text-sm text-gray-500">Estimated Price $ {item.price ?? 0}/hour</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>📈</span>
                    <span>3 hired recently</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>3 similar jobs done near you</span>
                  </div>
                </ul>
                <p className="text-sm text-gray-500 truncate">
                  {item.reviewHighlight}
                </p>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 px-4 py-3 flex justify-between items-center">
                <Link href={`/details?id=${item.expertId}&name=${encodeURIComponent(item.name)}`}>
                  <button
                    className="bg-blue-600 text-white px-4 py-2 text-sm font-medium rounded-lg hover:bg-blue-700 transition"
                  >
                    View profile
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
function capitalizeWords(str: string): string {
  return str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

