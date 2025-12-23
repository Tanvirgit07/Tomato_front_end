import { useQuery } from "@tanstack/react-query";
import React from "react";

interface TotalReviewsProps {
  productId: string | string[];
}

const TotalReviews: React.FC<TotalReviewsProps> = ({ productId }) => {
  const {
    data: reviewData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["totalReview", productId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/review/getsinglereview/${productId}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch review");
      }
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="bg-gray-50 p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg">
        <div className="animate-pulse">
          <div className="h-5 sm:h-6 bg-gray-200 rounded w-16 sm:w-20 mb-2"></div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-24 sm:w-32 mb-3 sm:mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-2 sm:gap-3">
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-10 sm:w-12"></div>
                <div className="h-1.5 sm:h-2 bg-gray-200 rounded flex-1"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-6 sm:w-8"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-3 sm:p-4 md:p-5 rounded-lg">
        <p className="text-red-600 text-sm sm:text-base">Failed to load reviews</p>
      </div>
    );
  }

  if (!reviewData?.reviewSummmery) {
    return (
      <div className="bg-gray-50 p-3 sm:p-4 md:p-5 rounded-lg">
        <p className="text-gray-600 text-sm sm:text-base">No reviews available</p>
      </div>
    );
  }

  const { reviewSummmery } = reviewData;
  const avgRating = parseFloat(reviewSummmery.avgRating);
  const totalReviews = reviewSummmery.totalReviews;
  const summary = reviewSummmery.summery;

  // Calculate percentages for progress bars
  const getPercentage = (count: number) => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
  };

  // Generate stars display
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(avgRating);
    const hasHalfStar = avgRating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <span key={i} className="text-yellow-400 text-base sm:text-lg md:text-xl">★</span>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <span key={i} className="text-yellow-400 text-base sm:text-lg md:text-xl relative">
            <span className="text-gray-300">★</span>
            <span className="absolute inset-0 overflow-hidden w-1/2">
              <span className="text-yellow-400">★</span>
            </span>
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-300 text-base sm:text-lg md:text-xl">★</span>
        );
      }
    }
    return stars;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 md:p-6 lg:p-7 w-full max-w-full">
      {/* Header with stars and rating */}
      <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 mb-1 sm:mb-1.5">
        <div className="flex gap-0.5 sm:gap-1">
          {renderStars()}
        </div>
        <span className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
          {avgRating.toFixed(1)}
        </span>
      </div>

      {/* Based on reviews text */}
      <p className="text-xs sm:text-sm md:text-base text-gray-500 mb-4 sm:mb-5 md:mb-6">
        Based on {totalReviews.toLocaleString()} reviews
      </p>

      {/* Rating bars */}
      <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = summary[rating] || 0;
          const percentage = getPercentage(count);
          
          return (
            <div key={rating} className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <span className="text-xs sm:text-sm md:text-base text-gray-600 w-10 sm:w-12 md:w-14 flex-shrink-0">
                {rating} Stars
              </span>
              
              <div className="flex-1 bg-gray-200 rounded-full h-1.5 sm:h-2 md:h-2.5 relative overflow-hidden min-w-0">
                <div 
                  className="bg-yellow-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              
              <span className="text-xs sm:text-sm md:text-base text-gray-600 w-6 sm:w-8 md:w-10 text-right flex-shrink-0">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TotalReviews;