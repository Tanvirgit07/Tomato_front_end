/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Star, User } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

function AllReview() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

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

  if (isLoading)
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading reviews...</p>
      </div>
    );

  if (isError)
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading reviews</p>
      </div>
    );

  const reviews = data?.data ?? [];
  if (reviews.length === 0)
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No reviews found</p>
      </div>
    );

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Simple Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Customer Reviews
          </h2>
          <p className="text-gray-600">What our customers say about us</p>
        </div>

        {/* Reviews Carousel */}
        <Carousel 
          className="w-full"
          plugins={[plugin.current]}
          opts={{
            align: "start",
            loop: true,
          }}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="-ml-6">
            {reviews.map((review: any) => (
              <CarouselItem key={review._id} className="pl-6 md:basis-1/2 lg:basis-1/3">
                <div className="bg-white rounded-lg shadow-md p-6 h-full border hover:shadow-lg transition-shadow">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {review.comment}
                  </p>

                  {/* User Info */}
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {review.user?.name || "Anonymous"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Verified Customer
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}

export default AllReview;