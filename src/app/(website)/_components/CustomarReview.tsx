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

  // Map API response into your review structure
  const reviewsData = useMemo(() => {
    if (!ratingData?.data) return [];
    return ratingData.data.map((review: any) => ({
      id: review._id,
      name: review.user?.name || "Anonymous User",
      avatar: review.user?.profileImage || "",
      rating: review.rating || 0,
      date: review.createdAt,
      title: review.title || "",
      content: review.content || "",
      helpful: review.helpful || 0,
      verified: review.user?.isVerified || false,
      category: review.food?.category?.name || "",
    }));
  }, [ratingData]);

  // Stats calculation
  const stats = useMemo(() => {
    const totalReviews = reviewsData.length;
    const averageRating =
      totalReviews > 0
        ? reviewsData.reduce(
            (sum: string, review: any) => sum + review.rating,
            0
          ) / totalReviews
        : 0;
    const ratingCounts = [5, 4, 3, 2, 1].map(
      (rating) =>
        reviewsData.filter((review: any) => review.rating === rating).length
    );
    return { totalReviews, averageRating, ratingCounts };
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

  // Stars component
  const StarRating: React.FC<StarRatingProps> = React.memo(
    ({ rating, size = "w-4 h-4" }) => {
      const validRating = Math.max(0, Math.min(5, Math.floor(rating || 0)));
      return (
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`${size} ${
                i < validRating
                  ? "fill-amber-400 text-amber-400"
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
            month: "long",
            day: "numeric",
          });
    } catch {
      return "Invalid date";
    }
  };
  const getInitials = (name: string) =>
    !name
      ? "U"
      : name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);

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

  // Handle loading & error
  if (isLoading) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold">Loading Reviews...</h2>
      </div>
    );
  }
  if (isError || !reviewsData || reviewsData.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold">No Reviews Yet</h2>
        <p>Be the first to leave a review!</p>
      </div>
    );
  }

  // -------------------
  // --- YOUR UI PART ---
  // -------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-slate-600">
            Real experiences from our valued customers
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-slate-200">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="text-5xl font-bold text-indigo-600 mb-2">
                  {stats.averageRating.toFixed(1)}
                </div>
                <StarRating rating={stats.averageRating} size="w-6 h-6" />
                <p className="text-sm text-slate-600 mt-2">
                  Based on {stats.totalReviews} reviews
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-slate-200 md:col-span-2 lg:col-span-2">
            <CardContent className="p-6">
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating, idx) => (
                  <div
                    key={rating}
                    className="flex items-center gap-4"
                    onClick={() => handleRatingFilter(rating.toString())}
                  >
                    <div className="flex items-center w-24">
                      <span className="text-sm font-medium text-slate-700 mr-2">
                        {rating}
                      </span>
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    </div>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            (stats.ratingCounts[idx] / stats.totalReviews) * 100
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-slate-600 w-12">
                      {stats.ratingCounts[idx]}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={toggleFilters}
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown
              className={`w-4 h-4 transform transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </Button>

          <select
            value={sortBy}
            onChange={handleSortChange}
            className="px-4 py-2 border rounded-lg text-slate-700"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>

        {showFilters && (
          <div className="mb-8 p-4 bg-white/60 rounded-lg shadow-sm">
            <div className="flex flex-wrap gap-2">
              <Badge
                onClick={() => handleRatingFilter("all")}
                className={`cursor-pointer ${
                  selectedRating === "all"
                    ? "bg-indigo-500 text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                All
              </Badge>
              {[5, 4, 3, 2, 1].map((rating) => (
                <Badge
                  key={rating}
                  onClick={() => handleRatingFilter(rating.toString())}
                  className={`cursor-pointer ${
                    selectedRating === rating.toString()
                      ? "bg-indigo-500 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {rating} Stars
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Carousel */}
        <div className="relative">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
              width: `${(filteredReviews.length / itemsPerSlide) * 100}%`,
            }}
          >
            {filteredReviews.map((review: any) => (
              <div
                key={review.id}
                className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-2"
              >
                <Card className="bg-white/80 backdrop-blur-sm h-full shadow-md hover:shadow-lg transition-shadow duration-300 border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-12 w-12">
                        {review.avatar ? (
                          <AvatarImage src={review.avatar} />
                        ) : (
                          <AvatarFallback>
                            <User className="h-6 w-6 text-slate-400" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {review.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {formatDate(review.date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <StarRating rating={review.rating} />
                      {review.verified && (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-700"
                        >
                          Verified Purchase
                        </Badge>
                      )}
                    </div>

                    <h3 className="font-medium text-slate-900 mb-2">
                      {review.title}
                    </h3>
                    <p className="text-slate-600 mb-4">{review.content}</p>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 text-slate-500 hover:text-indigo-600"
                      onClick={() => handleHelpfulClick(review.id)}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Helpful ({review.helpful})
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {maxSlides > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80"
                onClick={prevSlide}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80"
                onClick={nextSlide}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </>
          )}
        </div>

        {maxSlides > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: maxSlides }).map((_, i) => (
              <button
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentSlide
                    ? "bg-indigo-600 w-6"
                    : "bg-slate-300 hover:bg-slate-400"
                }`}
                onClick={() => goToSlide(i)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

CustomerReviews.displayName = "CustomerReviews";
export default CustomerReviews;
