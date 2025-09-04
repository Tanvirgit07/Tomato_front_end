/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Star, User } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function AllReview() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/review/allreviews`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.json();
    },
  });

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (isError)
    return (
      <div className="text-center text-red-500 py-10">
        Error loading reviews
      </div>
    );

  const reviews = data?.data ?? [];
  console.log("reviews" , reviews)
  if (reviews.length === 0)
    return (
      <div className="text-center py-10 text-gray-500">No reviews found</div>
    );

  return (
    <div className="">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
        Customer Reviews
      </h2>

      <Carousel className="w-full max-w-3xl mx-auto">
        <CarouselContent>
          {reviews.map((review: any) => (
            <CarouselItem key={review._id} className="p-4">
              <div className="p-6 rounded-2xl shadow-sm bg-white border border-gray-100 hover:shadow-md transition duration-300">
                {/* Header */}
                <div className="flex items-start gap-4">
                  {/* User Avatar */}
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 text-gray-500">
                    <User className="w-6 h-6" />
                  </div>

                  <div className="flex-1">
                    {/* User Info */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {review.user?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {review.user?.email}
                        </p>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Comment */}
                    <p className="mt-3 text-gray-700 leading-relaxed">
                      “{review.comment}”
                    </p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Carousel Controls */}
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>
    </div>
  );
}

export default AllReview;
