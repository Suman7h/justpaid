"use client";

import React, { useMemo, useState,useEffect } from "react";
import { useUser } from "./userContext";
interface reviewProps {
  expertId: string;
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
    userId:string;
    userName: string;
    dateOfReview: string;
  }[];
}


const Reviews = ({expertId}:reviewProps) => {
  const { user, isLoggedIn, login, logout } = useUser();
  const [newReviewId, setNewReviewId] = useState<string | null>(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newReview, setNewReview] = useState("");
  const [data1, setData1] = useState<ExpertData | null>(null); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const[newusername,setNewUserName]= useState<string | null>(null); 

  const ratingNames = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

  
  const toggleModal = () => setIsModalOpen(!isModalOpen);


  
  //   if (newRating > 0 && newReview.trim() !== "") {
  //     const parsedUserId = newReviewId ? parseInt(newReviewId, 10) : 0;
  //     const newReviewData = {
  //       userId: parsedUserId,
  //       expertId:expertId,
  //       numOfStars: newRating,
  //       review: newReview,
  //     };
  //     console.log(newReviewData)
  
  //     try {
  //       const response = await fetch("http://localhost:8000/review/", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(newReviewData),
  //       });
  
  //       if (!response.ok) {
  //         const errorData = await response.json();
  //         alert(`Error: ${errorData.error || "Failed to submit review."}`);
  //         return;
  //       }
  
  //       const result = await response.json();
  //       console.log("Review submitted successfully:", result);
  
  //       // Reset the modal and form
  //       setNewRating(0);
  //       setNewReview("");
  //       toggleModal();
  
  //     } catch (error) {
  //       console.error("Error submitting review:", error);
  //       alert("An unexpected error occurred while submitting the review.");
  //     }
  //   } else {
  //     alert("Please provide a rating and review.");
  //   }
  // };
  
  const handleSubmit = async () => {
    if (newRating > 0 && newReview.trim() !== "") {
      const parsedUserId = newReviewId ? parseInt(newReviewId, 10) : 0;
      const newReviewData = {
        userId: parsedUserId,
        expertId: expertId,
        numOfStars: newRating,
        review: newReview,
      };
      console.log(newReviewData);
  
      try {
        const response = await fetch("http://localhost:8000/review/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newReviewData),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          alert(`Error: ${errorData.error || "Failed to submit review."}`);
          return;
        }
  
        const result = await response.json();
        console.log("Review submitted successfully:", result);
  
        
        if (data1) {
          setData1((prevData) => {
            if (!prevData) return prevData;
  
            return {
              ...prevData,
              reviews: [
                ...prevData.reviews,
                {
                  reviewId: result.review.reviewId,
                  numOfStars: result.review.numOfStars,
                  review: result.review.review,
                  userId: result.review.userId,
                  userName: newusername || "Anonymous", 
                  dateOfReview: result.review.dateOfReview,
                },
              ],
            };
          });
        }
  
        
        setNewRating(0);
        setNewReview("");
        toggleModal();
      } catch (error) {
        console.error("Error submitting review:", error);
        alert("An unexpected error occurred while submitting the review.");
      }
    } else {
      alert("Please provide a rating and review.");
    }
  };
  
  useEffect(() => {
    if (user && user.Id) {
      setNewReviewId(user.Id.toString()); 
      setNewUserName(user.name);
    }
  }, [user]);
 
  
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
    <div className="p-6 max-w-4xl mx-auto">
      {/* Overall Rating */}
      <div className="border-b pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Overall rating</h2>
            <div className="flex items-center mt-2">
              {/* Stars */}
              <div className="flex text-yellow-500">
                {Array.from({ length: 5 }, (_, index) => (
                  <svg
                    key={index}
                    xmlns="http://www.w3.org/2000/svg"
                    fill={index < Math.round(data1?.averageRating || 0) ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 17.27l5.18 3.73-1.64-6.09L21 9.24l-6.16-.47L12 3 9.16 8.77 3 9.24l4.46 5.67L5.82 21z"
                    />
                  </svg>
                ))}
              </div>
              <p className="ml-3 text-gray-700">{data1?.reviewCount} reviews</p>
            </div>
          </div>

          {/* Write a Review Button */}
          <button
            onClick={toggleModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Write a Review
          </button>
        </div>


        <div className="mt-4">
          {Array.from({ length: 5 }, (_, index) => {
            const starCount = data1?.reviews.filter(
              (review) => review.numOfStars === 5 - index
            ).length??0; 
            const percentage = data1?.reviewCount
              ? ((starCount / data1.reviewCount) * 100).toFixed(1)
              : "0"; 

            return (
              <div key={5 - index} className="flex items-center mb-2">
                <p className="text-sm text-gray-700 w-12">{5 - index} stars</p>
                <div className="relative flex-1 bg-gray-200 rounded-full h-4 ml-3">
                  <div
                    className="absolute top-0 left-0 h-full bg-red-500 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-700 ml-3">{percentage}%</p>
              </div>
            );
          })}
        </div>

    </div>

    {data1?.reviews.map((review, index) => (
      <div key={index} className="mb-6">
        <div className="flex items-center">
          <img
            src="https://via.placeholder.com/50"
            alt={review.userName}
            className="w-12 h-12 rounded-full"
          />
          <div className="ml-3">
            <h3 className="text-sm font-medium">{review.userName}</h3>
            <p className="text-sm text-gray-500 ">{new Date(review.dateOfReview).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center mt-2">
          {/* Stars */}
          <div className="flex text-yellow-500">
            {Array.from({ length: review.numOfStars }, (_, index) => (
              <svg
                key={index}
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path d="M12 17.27l5.18 3.73-1.64-6.09L21 9.24l-6.16-.47L12 3 9.16 8.77 3 9.24l4.46 5.67L5.82 21z" />
              </svg>
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-700 mt-4 whitespace-pre-line">
          {review.review}
        </p>
      </div>
    ))}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Write a Review</h2>
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Write your review here..."
              className="w-full border p-2 rounded-lg mb-4"
            />
            <div className="flex items-center mb-4">
              {/* Star Selector */}
              {Array.from({ length: 5 }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setNewRating(index + 1)}
                  className={`text-3xl ${
                    index < newRating ? "text-yellow-500" : "text-gray-400"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={toggleModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
