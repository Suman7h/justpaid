"use client";

import React, { useState,useEffect } from "react";
import Reviews from "./reviews";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUser } from "@/components/userContext";
import { useRouter,useSearchParams } from "next/navigation";

interface detailsProps {
  name: string;
}
interface ExpertData {
  expertId: string;
  expertName: string;
  introduction: string;
  estimatedPrice: number;
  yearsInService: number;
  numOfEmployees: number;
  businessHours: { day: string; hours: string }[];
  paymentMethods: string[];
  averageRating: number;
  reviewCount: number;
  reviews: {
    reviewId: string;
    numOfStars: number;
    review: string;
    userName: string;
    dateOfReview: string;
  }[];
}

const Details = ({ name }: detailsProps) => {

  const router = useRouter();
  const searchParams = useSearchParams(); 
  const expertId = searchParams.get("id");
  const [data1, setData1] = useState<ExpertData | null>(null); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoggedIn, login, logout } = useUser();

  const handleMessageClick = (): string => {
    if (isLoggedIn) {
      const id = user?.Id; 
      const name = user?.name || ""; 
      const role = user?.role || ""; 
      const expert = expertId || "";
      

      
      return `/message?id=${id}&name=${encodeURIComponent(name)}&role=${encodeURIComponent(role)}&newchatId=${expert}&newchatName=${data1?.expertName}`;
    } else {
      
      const currentPath = encodeURIComponent(window.location.pathname + window.location.search);
      return `/auth/login?redirect=${currentPath}`;
    }
  };
  
  useEffect(() => {
    const fetchExpertDetails = async () => {
      if (!expertId) {
        setError("Expert ID is missing.");
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/details/?id=${encodeURIComponent(expertId)}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch expert details.");
        }

        const result = await response.json();
        console.log("API Response:", result);
        setData1(result); 
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchExpertDetails();
  }, [expertId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;


return (
  <main className="p-6 w-full min-h-screen">
    {data1&& (
      <div
        key={data1.expertName}
        className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
      >
        {/* Header Section */}
        <div className="flex items-center p-6 border-b border-gray-200">
          <img
            src={"https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=3556&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
            alt={name}
            className="w-20 h-20 rounded-full"
          />
          <div className="ml-4">
            <h1 className="text-2xl font-bold">{data1.expertName}</h1>
            <p className="text-green-600 font-medium">
              Exceptional {data1.averageRating}.0{" "}
              <span className="text-gray-500">({data1.reviewCount})</span>
            </p>
          </div>
          <div className="ml-auto">
            <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
              Save
            </button>
          </div>
        </div>

        {/* Introduction Section */}
        <section className="p-6">
          <h2 className="text-lg font-semibold">Introduction</h2>
          <p className="text-gray-600 mt-2">{data1.introduction}</p>
        </section>

        {/* Overview and Payment Methods Section */}
        <section className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200">
          {/* Overview */}
          <div>
            <h3 className="text-lg font-semibold">Overview</h3>
            <ul className="mt-2 text-gray-600 space-y-2">
              <li>🏆 Hired 3 times</li>
              <li>📍 3 similar job done near you</li>
              <li>✅ Background Checked</li>
              <li>👥 {data1.numOfEmployees} employees</li>
              <li>📆 {data1.yearsInService} years in business</li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="text-lg font-semibold">Payment methods</h3>
            <p className="mt-2 text-gray-600">
              This Expert accepts payments via{" "}
              {formatPaymentMethods(data1.paymentMethods)}.
            </p>
            <h4 className="mt-4 text-lg font-semibold">Social media</h4>
            <p className="text-blue-600 mt-1 space-x-2">
              <a href="#" className="hover:underline">
                Facebook
              </a>
              <a href="#" className="hover:underline">
                Instagram
              </a>
            </p>
          </div>
        </section>

        {/* Business Hours Section */}

        <section className="p-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold">Business hours</h3>
          <ul className="mt-2 text-gray-600">
            {Object.entries(data1.businessHours).map(([day, hours], index) => {
              if (typeof hours === "object" && "open" in hours && "close" in hours) {
                const hoursObj = hours as { open: string; close: string };
                return (
                  <li key={index}>
                    🕒 {day}: {hoursObj.open} - {hoursObj.close}
                  </li>
                );
              }
              return (
                <li key={index}>
                  🕒 {day}: Closed
                </li>
              );
            })}
          </ul>
        </section>

        {/* Footer Section */}
        <section className="p-6 border-t border-gray-200 flex justify-around">
          <Link href={handleMessageClick()}>
            <Button variant="default" className="text-white">message</Button>
          </Link>


          <button className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
            Request a call
          </button>
        </section>
      </div>
    )}

    {/* Star Rating Section */}
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-6 p-6">
      <Reviews expertId={data1?.expertId || ""} />
    </div>
  </main>
);
};


const formatPaymentMethods = (methods: string[]): string => {
  if (methods.length === 0) return "";
  if (methods.length === 1) return methods[0];
  return methods.slice(0, -1).join(", ") + ", and " + methods[methods.length - 1];
};



export default Details;
