"use client";
import React, { useState, useMemo } from "react";
import {
  Star,
  ThumbsUp,
  User,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// shadcn/ui components
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";

interface StarRatingProps {
  rating: number;
  size?: string;
}

// Dummy review data
const reviewsData = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "",
    rating: 5,
    date: "2024-01-15",
    title: "Absolutely amazing product!",
    content:
      "I've been using this product for 3 months now and it has completely transformed my daily routine. The quality is outstanding and the customer service is top-notch. Highly recommend to anyone looking for a reliable solution.",
    helpful: 23,
    verified: true,
    category: "Quality",
  },
  {
    id: 2,
    name: "Mike Chen",
    avatar: "",
    rating: 4,
    date: "2024-01-10",
    title: "Great value for money",
    content:
      "Really impressed with the build quality and features. Setup was straightforward and everything works as advertised. Only minor complaint is that shipping took a bit longer than expected, but the product itself is excellent.",
    helpful: 18,
    verified: true,
    category: "Value",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    avatar: "",
    rating: 5,
    date: "2024-01-08",
    title: "Exceeded my expectations",
    content:
      "Initially I was hesitant about the price, but after using it for several weeks, I can confidently say it's worth every penny. The attention to detail is remarkable and it has made such a difference in my workflow.",
    helpful: 31,
    verified: true,
    category: "Performance",
  },
  {
    id: 4,
    name: "David Thompson",
    avatar: "",
    rating: 3,
    date: "2024-01-05",
    title: "Good but has some issues",
    content:
      "The product works well overall, but I did encounter a few minor bugs in the first week. Customer support was responsive and helped resolve the issues. It's a solid product, just needs some polish.",
    helpful: 12,
    verified: false,
    category: "Support",
  },
  {
    id: 5,
    name: "Lisa Wang",
    avatar: "",
    rating: 5,
    date: "2024-01-02",
    title: "Perfect for my needs",
    content:
      "This is exactly what I was looking for. The interface is intuitive, performance is smooth, and it integrates perfectly with my existing setup. Installation was a breeze and I was up and running in minutes.",
    helpful: 27,
    verified: true,
    category: "Ease of Use",
  },
  {
    id: 6,
    name: "Robert Kim",
    avatar: "",
    rating: 4,
    date: "2023-12-28",
    title: "Solid choice",
    content:
      "Been using this for about a month now. It's reliable and does what it promises. The documentation could be better, but overall it's a good purchase. Would recommend to others in similar situations.",
    helpful: 15,
    verified: true,
    category: "Documentation",
  },
  {
    id: 7,
    name: "Anna Martinez",
    avatar: "",
    rating: 5,
    date: "2023-12-25",
    title: "Outstanding quality",
    content:
      "This exceeded all my expectations. The build quality is exceptional and the attention to detail is remarkable. Customer service was also very responsive when I had questions.",
    helpful: 19,
    verified: true,
    category: "Quality",
  },
  {
    id: 8,
    name: "Tom Wilson",
    avatar: "",
    rating: 4,
    date: "2023-12-20",
    title: "Very satisfied",
    content:
      "Great product overall. Easy to use and works exactly as described. Shipping was fast and packaging was excellent. Would definitely purchase again.",
    helpful: 14,
    verified: true,
    category: "Experience",
  },
];

const CustomerReviews = () => {
  const [selectedRating, setSelectedRating] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Memoized calculations for performance
  const stats = useMemo(() => {
    const totalReviews = reviewsData.length;
    const averageRating =
      totalReviews > 0
        ? reviewsData.reduce((sum, review) => sum + review.rating, 0) /
          totalReviews
        : 0;
    const ratingCounts = [5, 4, 3, 2, 1].map(
      (rating) =>
        reviewsData.filter((review) => review.rating === rating).length
    );
    return { totalReviews, averageRating, ratingCounts };
  }, []);

  // Memoized filtered and sorted reviews
  const filteredReviews = useMemo(() => {
    return reviewsData
      .filter((review) => {
        if (selectedRating === "all") return true;
        const ratingNumber = parseInt(selectedRating, 10);
        return !isNaN(ratingNumber) && review.rating === ratingNumber;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          case "oldest":
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          case "highest":
            return b.rating - a.rating;
          case "lowest":
            return a.rating - b.rating;
          case "helpful":
            return b.helpful - a.helpful;
          default:
            return 0;
        }
      });
  }, [selectedRating, sortBy]);

  // Carousel logic - responsive items per slide
  const getItemsPerSlide = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }
    return 3;
  };

  const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide);

  React.useEffect(() => {
    const handleResize = () => {
      setItemsPerSlide(getItemsPerSlide());
      const maxSlide = Math.max(
        0,
        Math.ceil(filteredReviews.length / getItemsPerSlide()) - 1
      );
      if (currentSlide > maxSlide) {
        setCurrentSlide(0);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentSlide, filteredReviews.length]);

  const maxSlides = Math.ceil(filteredReviews.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % maxSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + maxSlides) % maxSlides);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  const StarRating: React.FC<StarRatingProps> = React.memo(
    ({ rating, size = "w-4 h-4" }) => {
      const validRating = Math.max(0, Math.min(5, Math.floor(rating || 0)));

      return (
        <div
          className="flex items-center gap-0.5"
          role="img"
          aria-label={`${validRating} out of 5 stars`}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`${size} transition-colors duration-200 ${
                i < validRating
                  ? "fill-amber-400 text-amber-400"
                  : "fill-slate-200 text-slate-200"
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
      );
    }
  );

  StarRating.displayName = "StarRating";

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const { data: ratingData } = useQuery({
  queryKey: ['rating'],
  queryFn: async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/review/allreviews`
    );

    if (!res.ok) {
      throw new Error('Failed to fetch reviews');
    }

    return res.json();
  },
});

  const getInitials = (name: string) => {
    if (!name || typeof name !== "string") return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleRatingFilter = (rating: string) => {
    setSelectedRating(rating);
    setCurrentSlide(0);
  };

  const handleSortChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setSortBy(event.target.value);
    setCurrentSlide(0);
  };

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const handleHelpfulClick = (reviewId: number) => {
    console.log(`Marked review ${reviewId} as helpful`);
  };

  if (!reviewsData || reviewsData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Star className="w-10 h-10 text-slate-500" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              No Reviews Yet
            </h2>
            <p className="text-slate-600 text-lg">
              Be the first to leave a review and help others discover this
              amazing product!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="container mx-auto p-4 sm:p-6 flex flex-col">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 px-6 py-3 rounded-full mb-6">
            <Star className="w-5 h-5 text-indigo-600 fill-current" />
            <span className="text-indigo-700 font-semibold text-sm uppercase tracking-wide">
              Customer Feedback
            </span>
          </div>

          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 bg-clip-text text-transparent">
              What Our Customers
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Are Saying
            </span>
          </h1>

          <p className="text-slate-600 text-xl max-w-3xl mx-auto leading-relaxed">
            Real experiences from real customers who have transformed their
            lives with our products
          </p>
        </div>

        {/* Rating Summary */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl  border border-slate-100 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-full -translate-y-20 translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-100/50 to-orange-100/50 rounded-full translate-y-16 -translate-x-16"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Overall Rating */}
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-4">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl p-4 mr-6">
                    <span className="text-4xl font-bold">
                      {stats.averageRating.toFixed(1)}
                    </span>
                  </div>
                  <div>
                    <StarRating
                      rating={Math.round(stats.averageRating)}
                      size="w-7 h-7"
                    />
                    <p className="text-slate-600 mt-2 font-medium">
                      Based on {stats.totalReviews} review
                      {stats.totalReviews !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rating Breakdown */}
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating, index) => {
                  const count = stats.ratingCounts[index] || 0;
                  const percentage =
                    stats.totalReviews > 0
                      ? (count / stats.totalReviews) * 100
                      : 0;

                  return (
                    <div key={rating} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-12">
                        <span className="text-slate-700 font-medium">
                          {rating}
                        </span>
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      </div>
                      <div className="flex-1 bg-slate-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-400 to-orange-400 h-3 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-slate-600 font-medium w-8">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        {/* Filters and Sort */}
        <div className="mb-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Button
            variant="outline"
            onClick={toggleFilters}
            className="flex items-center gap-2 text-sm"
            aria-expanded={showFilters}
            aria-controls="filter-options"
          >
            <Filter className="w-4 h-4" aria-hidden="true" />
            Filters
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                showFilters ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </Button>

          <div className="flex gap-2">
            <label htmlFor="sort-select" className="sr-only">
              Sort reviews by
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={handleSortChange}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <Card className="mb-4" id="filter-options">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedRating === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleRatingFilter("all")}
                  aria-pressed={selectedRating === "all"}
                >
                  All Ratings
                </Button>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <Button
                    key={rating}
                    variant={
                      selectedRating === rating.toString()
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => handleRatingFilter(rating.toString())}
                    className="flex items-center gap-1"
                    aria-pressed={selectedRating === rating.toString()}
                  >
                    {rating} <Star className="w-3 h-3" aria-hidden="true" />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reviews Carousel Container - Fixed Height */}
        <div className="flex-1 min-h-0 flex flex-col">
          {filteredReviews.length === 0 ? (
            <Card className="flex-1">
              <CardContent className="p-6 text-center flex items-center justify-center h-full">
                <div>
                  <p className="text-gray-600 mb-4">
                    No reviews match your current filters.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => handleRatingFilter("all")}
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex-1 flex flex-col">
              {/* Carousel Container */}
              <div className="relative flex-1 overflow-hidden">
                <div
                  className="flex transition-transform duration-300 ease-in-out h-full"
                  style={{
                    transform: `translateX(-${currentSlide * 100}%)`,
                  }}
                >
                  {Array.from({ length: maxSlides }, (_, slideIndex) => (
                    <div
                      key={slideIndex}
                      className="flex-shrink-0 w-full h-full"
                    >
                      <div
                        className={`grid gap-4 h-full ${
                          itemsPerSlide === 1
                            ? "grid-cols-1"
                            : itemsPerSlide === 2
                            ? "grid-cols-1 sm:grid-cols-2"
                            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                        }`}
                      >
                        {filteredReviews
                          .slice(
                            slideIndex * itemsPerSlide,
                            (slideIndex + 1) * itemsPerSlide
                          )
                          .map((review) => (
                            <Card
                              key={review.id}
                              className="hover:shadow-lg transition-shadow duration-200 flex flex-col h-full"
                            >
                              <CardContent className="p-4 sm:p-6 flex flex-col h-full">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                                    <Avatar className="flex-shrink-0">
                                      <AvatarImage
                                        src={review.avatar}
                                        alt={`${review.name}'s avatar`}
                                        onError={(e) => {
                                          e.currentTarget.style.display =
                                            "none";
                                        }}
                                      />
                                      <AvatarFallback>
                                        {review.avatar ? (
                                          <User className="w-4 h-4" />
                                        ) : (
                                          getInitials(review.name)
                                        )}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                          {review.name || "Anonymous User"}
                                        </h3>
                                        {review.verified && (
                                          <Badge
                                            variant="secondary"
                                            className="text-xs"
                                          >
                                            Verified
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <StarRating rating={review.rating} />
                                        <span className="text-xs sm:text-sm text-gray-600">
                                          {formatDate(review.date)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  {review.category && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs flex-shrink-0 ml-2"
                                    >
                                      {review.category}
                                    </Badge>
                                  )}
                                </div>

                                <div className="flex-1 flex flex-col">
                                  {review.title && (
                                    <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base line-clamp-2">
                                      {review.title}
                                    </h4>
                                  )}
                                  {review.content && (
                                    <p className="text-gray-700 mb-4 leading-relaxed text-sm sm:text-base flex-1 overflow-hidden">
                                      <span className="line-clamp-4">
                                        {review.content}
                                      </span>
                                    </p>
                                  )}

                                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-xs sm:text-sm p-1 sm:p-2"
                                      onClick={() =>
                                        handleHelpfulClick(review.id)
                                      }
                                      aria-label={`Mark this review as helpful. Currently ${review.helpful} people found this helpful.`}
                                    >
                                      <ThumbsUp
                                        className="w-3 h-3 sm:w-4 sm:h-4"
                                        aria-hidden="true"
                                      />
                                      <span className="hidden sm:inline">
                                        Helpful
                                      </span>{" "}
                                      ({review.helpful || 0})
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                {maxSlides > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg"
                      onClick={prevSlide}
                      disabled={currentSlide === 0}
                      aria-label="Previous reviews"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg"
                      onClick={nextSlide}
                      disabled={currentSlide === maxSlides - 1}
                      aria-label="Next reviews"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>

              {/* Carousel Indicators */}
              {maxSlides > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  {Array.from({ length: maxSlides }, (_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                        index === currentSlide ? "bg-blue-600" : "bg-gray-300"
                      }`}
                      onClick={() => goToSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

CustomerReviews.displayName = "CustomerReviews";

export default CustomerReviews;
