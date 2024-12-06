"use client";

import React, { useState,useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

const ExpertRegistrationPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [companyName, setCompanyName] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [location,setLocation]=useState("");
  const [estimatedPrice, setEstimatedPrice] = useState("");
  const [yearsInService, setYearsInService] = useState("");
  const [numOfEmployees, setNumOfEmployees] = useState("");
  const [businessHours, setBusinessHours] = useState<Record<string, { open: string; close: string }>>({});
  const [paymentMethods, setPaymentMethods] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [expertId, setExpertId] = useState<string | null>(null); 
 
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = [
    "Accountants",
    "CFO",
    "AR Revenue Collection Specialists",
    "Certified Financial Advisors",
  ];

  const handleBusinessHoursChange = (day: string, field: "open" | "close", value: string) => {
    setBusinessHours((prevHours) => ({
      ...prevHours,
      [day]: {
        ...prevHours[day],
        [field]: value,
      },
    }));
  };
  const handleCategoryChange = (category: string) => {
    if (selectedCategories.includes(category)) {
      
      setSelectedCategories(selectedCategories.filter((item) => item !== category));
    } else {
      
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  useEffect(() => {
    const expertIdFromUrl = searchParams.get("user_id");
    setExpertId(expertIdFromUrl);
  }, [searchParams]);

  const handleExpertRegistration = async () => {
    setLoading(true);

    try {
      if (!expertId) {
        throw new Error("Expert ID is missing. Please ensure you are redirected from the registration page.");
      }

      
      const payload = {
        expertId, 
        companyName,
        location: location.toLowerCase(),
        introduction,
        estimatedPrice: parseFloat(estimatedPrice), 
        yearsInService: parseInt(yearsInService, 10), 
        numOfEmployees: parseInt(numOfEmployees, 10), 
        businessHours, 
        paymentMethods: paymentMethods
        .split(",") 
        .map((method) => method.trim()), 
        categories: selectedCategories.map((category) => category.toLowerCase()), 
      };

      console.log("Payload sent to backend:", payload);

      
      const response = await fetch("http://localhost:8000/register/expert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Expert registration failed.");
      }

      const result = await response.json();
      console.log("Expert registration successful:", result);

     
      router.push(redirect);
    } catch (err: any) {
      console.error("Error completing expert registration:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="h-screen flex flex-col items-center justify-start p-6">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Complete Expert Registration</h1>
        <p className="text-gray-600 mb-6">
          Please provide additional information to complete your expert profile.
        </p>

        {/* Company Name */}
        <div className="mb-4">
          <label htmlFor="companyName" className="block text-gray-700 font-medium mb-1">
            Company Name
          </label>
          <input
            type="text"
            id="companyName"
            placeholder="Enter company name"
            className="w-full border border-gray-300 rounded-lg p-2"
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="location" className="block text-gray-700 font-medium mb-1">
            Location
          </label>
          <input
            id="location"
            placeholder="Provide location wher you are working from"
            className="w-full border border-gray-300 rounded-lg p-2 resize-none"
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="introduction" className="block text-gray-700 font-medium mb-1">
            Introduction
          </label>
          <textarea
            id="introduction"
            placeholder="Provide a brief introduction about your expertise..."
            rows={4}
            className="w-full border border-gray-300 rounded-lg p-2 resize-none"
            onChange={(e) => setIntroduction(e.target.value)}
          />
        </div>

        {/* Estimated Price */}
        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700 font-medium mb-1">
            Estimated Price (e.g., per hour)
          </label>
          <input
            type="number"
            id="price"
            placeholder="80"
            className="w-full border border-gray-300 rounded-lg p-2"
            onChange={(e) => setEstimatedPrice(e.target.value)}
          />
        </div>

        {/* Years in Service */}
        <div className="mb-4">
          <label htmlFor="years" className="block text-gray-700 font-medium mb-1">
            Years in Service
          </label>
          <input
            type="number"
            id="years"
            placeholder="Enter years in service"
            className="w-full border border-gray-300 rounded-lg p-2"
            onChange={(e) => setYearsInService(e.target.value)}
          />
        </div>

        {/* Number of Employees */}
        <div className="mb-4">
          <label htmlFor="employees" className="block text-gray-700 font-medium mb-1">
            Number of Employees
          </label>
          <input
            type="number"
            id="employees"
            placeholder="Enter number of employees"
            className="w-full border border-gray-300 rounded-lg p-2"
            onChange={(e) => setNumOfEmployees(e.target.value)}
          />
        </div>

        {/* Business Hours */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Business Hours</h3>
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
            <div key={day} className="flex items-center space-x-2 mb-2">
              <label className="w-24 text-gray-700">{day}</label>
              <input
                type="time"
                className="border border-gray-300 rounded-lg p-2 w-32"
                placeholder="Open"
                onChange={(e) => handleBusinessHoursChange(day, "open", e.target.value)}
              />
              <span className="mx-2">-</span>
              <input
                type="time"
                className="border border-gray-300 rounded-lg p-2 w-32"
                placeholder="Close"
                onChange={(e) => handleBusinessHoursChange(day, "close", e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <label htmlFor="paymentMethods" className="block text-gray-700 font-medium mb-1">
            Payment Methods Accepted
          </label>
          <input
            type="text"
            id="paymentMethods"
            placeholder="e.g., Cash, Credit Card"
            className="w-full border border-gray-300 rounded-lg p-2"
            onChange={(e) => setPaymentMethods(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Select Categories Which You Are Best At</h3>
          {categories.map((category) => (
            <div key={category} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={category}
                className="mr-2"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
              />
              <label htmlFor={category} className="text-gray-700">
                {category}
              </label>
            </div>
          ))}
        </div>

        <Button
          onClick={handleExpertRegistration}
          className="w-full"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Complete Registration"}
        </Button>
      </div>
    </div>
  );
};

export default ExpertRegistrationPage;
