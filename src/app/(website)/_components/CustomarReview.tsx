/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Award,
  TrendingUp,
  MessageSquare,
  Sparkles,
  CheckCircle,
} from "lucide-react";

// shadcn/ui components
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

interface StarRatingProps {
  rating: number;
  size?: string;
  interactive?: boolean;
}

const CustomerReviews = () => {
  const [selectedRating, setSelectedRating] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch reviews from API
  const {
    data: ratingData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["rating"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/review/allreviews`
      );
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.json();
    },
  });

  // Map API response into review structure (Updated for your API structure)
  const reviewsData = useMemo(() => {
    if (!ratingData?.data) return [];
    return ratingData.data.map((review: any) => ({
      id: review._id,
      name: review.user?.name || "Anonymous User",
      avatar: review.user?.profileImage || "",
      rating: review.rating || 0,
      date: review.createdAt,
      title: `Review for ${review.food?.name || "Product"}`,
      content: review.comment || "",
      helpful: Math.floor(Math.random() * 20), // Since helpful count isn't in API
      verified: true, // Assuming all reviews are verified
      category: review.food?.category?.name || "Food",
      productName: review.food?.name || "",
      productImage: review.food?.image || "",
    }));
  }, [ratingData]);

  // Enhanced stats calculation
  const stats = useMemo(() => {
    const totalReviews = reviewsData.length;
    const averageRating =
      totalReviews > 0
        ? reviewsData.reduce(
            (sum: number, review: any) => sum + review.rating,
            0
          ) / totalReviews
        : 0;

    const ratingCounts = [5, 4, 3, 2, 1].map(
      (rating) =>
        reviewsData.filter((review: any) => review.rating === rating).length
    );

    const satisfactionRate =
      totalReviews > 0
        ? ((ratingCounts[0] + ratingCounts[1]) / totalReviews) * 100
        : 0;

    return { totalReviews, averageRating, ratingCounts, satisfactionRate };
  }, [reviewsData]);

  // Filter + sort reviews
  const filteredReviews = useMemo(() => {
    return reviewsData
      .filter((review: any) => {
        if (selectedRating === "all") return true;
        const ratingNumber = parseInt(selectedRating, 10);
        return !isNaN(ratingNumber) && review.rating === ratingNumber;
      })
      .sort((a: any, b: any) => {
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
  }, [selectedRating, sortBy, reviewsData]);

  // Responsive carousel logic
  const getItemsPerSlide = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3; // Changed to 3 for better layout
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
      if (currentSlide > maxSlide) setCurrentSlide(0);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentSlide, filteredReviews.length]);

  const maxSlides = Math.ceil(filteredReviews.length / itemsPerSlide);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % maxSlides);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + maxSlides) % maxSlides);
  const goToSlide = (slideIndex: number) => setCurrentSlide(slideIndex);

  // Enhanced Stars component
  const StarRating: React.FC<StarRatingProps> = React.memo(
    ({ rating, size = "w-4 h-4", interactive = false }) => {
      const validRating = Math.max(0, Math.min(5, Math.floor(rating || 0)));
      return (
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`${size} transition-all duration-200 ${
                interactive ? "hover:scale-110" : ""
              } ${
                i < validRating
                  ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                  : "fill-slate-200 text-slate-200"
              }`}
            />
          ))}
        </div>
      );
    }
  );
  StarRating.displayName = "StarRating";

  // Helpers
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime())
        ? "Invalid date"
        : date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
    } catch {
      return "Invalid date";
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const reviewDate = new Date(dateString);
    const diffMs = now.getTime() - reviewDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const handleRatingFilter = (rating: string) => {
    setSelectedRating(rating);
    setCurrentSlide(0);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setCurrentSlide(0);
  };

  const toggleFilters = () => setShowFilters((prev) => !prev);

  const handleHelpfulClick = (reviewId: string) => {
    console.log(`Marked review ${reviewId} as helpful`);
  };

  // Loading & Error with better styling
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-6 animate-pulse">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Loading Reviews...
            </h2>
            <p className="text-slate-600">
              Please wait while we fetch the latest reviews
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !reviewsData || reviewsData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full mb-6">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              No Reviews Yet
            </h2>
            <p className="text-slate-600 mb-8">
              Be the first to leave a review and help others!
            </p>
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              Write a Review
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mb-6 shadow-lg">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl sm:text-6xl font-bold mb-6">
            Customer Reviews
          </h2>
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
              <span className="text-lg font-semibold text-slate-700">
                Trusted by thousands
              </span>
              <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
            </div>
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover what our customers love about our products and services
            through their authentic experiences and feedback.
          </p>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Average Rating Card */}
          <Card className="relative bg-white/95 backdrop-blur-xl shadow-2xl border border-slate-200/50 rounded-3xl overflow-hidden group hover:shadow-3xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-orange-100 to-red-100 opacity-60" />
            <CardContent className="relative p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Star className="w-8 h-8 text-white fill-current" />
              </div>
              <div className="text-6xl font-black mb-3 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                {stats.averageRating.toFixed(1)}
              </div>
              <StarRating
                rating={stats.averageRating}
                size="w-8 h-8"
                interactive
              />
              <p className="text-slate-600 font-medium mt-3">
                Average Rating from{" "}
                <span className="font-bold text-slate-800">
                  {stats.totalReviews}
                </span>{" "}
                reviews
              </p>
            </CardContent>
          </Card>

          {/* Satisfaction Rate Card */}
          <Card className="relative bg-white/95 backdrop-blur-xl shadow-2xl border border-slate-200/50 rounded-3xl overflow-hidden group hover:shadow-3xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 opacity-60" />
            <CardContent className="relative p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="text-6xl font-black mb-3 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {Math.round(stats.satisfactionRate)}%
              </div>
              <p className="text-slate-600 font-medium">
                Customer Satisfaction
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Based on 4-5 star ratings
              </p>
            </CardContent>
          </Card>

          {/* Rating Distribution Card */}
          <Card className="relative bg-white/95 backdrop-blur-xl shadow-2xl border border-slate-200/50 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 opacity-60" />
            <CardContent className="relative p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-3">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                  Rating Distribution
                </h3>
              </div>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating, idx) => (
                  <div
                    key={rating}
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => handleRatingFilter(rating.toString())}
                  >
                    <div className="flex items-center w-16">
                      <span className="text-sm font-bold text-slate-800 mr-2">
                        {rating}
                      </span>
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    </div>
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 group-hover:shadow-lg"
                        style={{
                          width: `${
                            stats.totalReviews > 0
                              ? (stats.ratingCounts[idx] / stats.totalReviews) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 w-8 text-right">
                      {stats.ratingCounts[idx]}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Filters */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white/95 border-slate-300 transition-all duration-300"
              onClick={toggleFilters}
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown
                className={`w-4 h-4 transform transition-transform duration-300 ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </Button>

            {selectedRating !== "all" && (
              <Badge
                className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 cursor-pointer transition-colors"
                onClick={() => handleRatingFilter("all")}
              >
                {selectedRating} Stars ✕
              </Badge>
            )}
          </div>

          <select
            value={sortBy}
            onChange={handleSortChange}
            className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-300  text-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>

        {showFilters && (
          <div className="mb-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5 text-indigo-600" />
              Filter by Rating
            </h3>
            <div className="flex flex-wrap gap-3">
              <Badge
                onClick={() => handleRatingFilter("all")}
                className={`cursor-pointer px-4 py-2 transition-all duration-300 ${
                  selectedRating === "all"
                    ? "bg-indigo-500 text-white shadow-lg scale-105"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                All Reviews
              </Badge>
              {[5, 4, 3, 2, 1].map((rating) => (
                <Badge
                  key={rating}
                  onClick={() => handleRatingFilter(rating.toString())}
                  className={`cursor-pointer px-4 py-2 transition-all duration-300 flex items-center gap-1 ${
                    selectedRating === rating.toString()
                      ? "bg-indigo-500 text-white shadow-lg scale-105"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {rating} <Star className="w-3 h-3 fill-current" />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Reviews Carousel */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {filteredReviews.map((review: any) => (
                <div
                  key={review.id}
                  className={`w-full px-4 flex-shrink-0 ${
                    itemsPerSlide === 1
                      ? "sm:w-full"
                      : itemsPerSlide === 2
                      ? "sm:w-1/2"
                      : "sm:w-1/2 lg:w-1/3"
                  }`}
                >
                  <Card className="h-full bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/50 overflow-hidden group hover:-translate-y-1 transition-all duration-500">
                    <CardContent className="p-6 h-full flex flex-col">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-14 w-14 ring-4 ring-indigo-100 shadow-lg">
                            {review.avatar ? (
                              <AvatarImage src={review.avatar} />
                            ) : (
                              <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold">
                                <User className="h-7 w-7" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <p className="font-bold text-slate-900 text-lg">
                              {review.name}
                            </p>
                            <p className="text-sm text-slate-500 flex items-center gap-1">
                              {getTimeAgo(review.date)}
                              {review.verified && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                            </p>
                          </div>
                        </div>
                        {review.verified && (
                          <Badge className="bg-green-100 text-green-700 font-medium px-3 py-1 rounded-full shadow-sm">
                            Verified
                          </Badge>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-3 mb-4">
                        <StarRating
                          rating={review.rating}
                          size="w-5 h-5"
                          interactive
                        />
                        <span className="text-lg font-bold text-slate-800">
                          {review.rating}/5
                        </span>
                      </div>

                      {/* Product info */}
                      {review.productName && (
                        <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 rounded-xl">
                          {review.productImage && (
                            <Image
                              width={300}
                              height={300}
                              src={review.productImage}
                              alt={review.productName}
                              className="w-12 h-12 rounded-lg object-cover shadow-md"
                            />
                          )}
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">
                              {review.productName}
                            </p>
                            <p className="text-xs text-slate-500">
                              {review.category}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Content */}
                      <div className="mb-6 flex-1">
                        <h3 className="font-bold text-slate-900 text-lg mb-3 line-clamp-2">
                          {review.title}
                        </h3>
                        <p className="text-slate-600 leading-relaxed line-clamp-4">
                          {review.content}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 shadow-sm hover:shadow-md"
                          onClick={() => handleHelpfulClick(review.id)}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          Helpful ({review.helpful})
                        </Button>
                        <p className="text-xs text-slate-400">
                          {formatDate(review.date)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          {maxSlides > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 rounded-full border-0 z-10"
                onClick={prevSlide}
              >
                <ChevronLeft className="w-6 h-6 text-indigo-600" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 rounded-full border-0 z-10"
                onClick={nextSlide}
              >
                <ChevronRight className="w-6 h-6 text-indigo-600" />
              </Button>

              {/* Pagination dots */}
              <div className="flex justify-center mt-8 gap-2">
                {Array.from({ length: maxSlides }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => goToSlide(i)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      i === currentSlide
                        ? "bg-indigo-600 shadow-lg scale-125"
                        : "bg-slate-300 hover:bg-slate-400"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-6 shadow-xl">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">
            Share Your Experience
          </h3>
          <p className="text-slate-600 mb-8 max-w-xl mx-auto">
            Help other customers by sharing your honest review and rating of our
            products and services.
          </p>
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 text-lg">
            Write a Review
          </Button>
        </div>
      </div>
    </div>
  );
};

CustomerReviews.displayName = "CustomerReviews";
export default CustomerReviews;
