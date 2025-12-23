/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Star } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ----------------- Types -----------------
interface ProductData {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  image: string;
  reviews: any[];
  category: { _id: string; name: string };
  subCategory: { _id: string; name: string };
}

interface CustomerReviewsFormProps {
  productData: ProductData;
}

// ----------------- Schema -----------------
const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating"),
  review: z.string().min(3, "Review must be at least 3 characters"),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  saveInfo: z.boolean().optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

// ----------------- Component -----------------
const CustomerReviewsForm: React.FC<CustomerReviewsFormProps> = ({ productData }) => {
  const { data: session } = useSession();
  const user = session?.user as any;
  const userId = user?.id;

  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      review: "",
      name: "",
      email: "",
      saveInfo: false,
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: async (newReview: {
      user: string;
      food: string;
      rating: number;
      comment: string;
    }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/review/createreview`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newReview),
        }
      );

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to create review");
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Review submitted successfully!");
      reset();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to submit review");
    },
  });

  const onSubmit = (formData: ReviewFormData) => {
    const reviewData = {
      user: userId,
      food: productData._id,
      rating: formData.rating,
      comment: formData.review.trim(),
    };
    createReviewMutation.mutate(reviewData);
  };

  const renderStars = (value: number, onChange: (val: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      const isActive = starValue <= (hoveredRating || value);

      return (
        <button
          key={starValue}
          type="button"
          onClick={() => onChange(starValue)}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          className="focus:outline-none transition-all duration-200 hover:scale-110"
        >
          <Star
            className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 ${
              isActive
                ? "fill-yellow-400 text-yellow-400 drop-shadow-md"
                : "fill-transparent text-gray-300 hover:text-yellow-400"
            } transition-colors`}
          />
        </button>
      );
    });
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 md:p-10 lg:p-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 sm:mb-10 text-center sm:text-left">
          Write a Review
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7 sm:space-y-8">
          {/* Rating */}
          <div className="space-y-3">
            <label className="text-base sm:text-lg font-semibold text-gray-800">
              Your Rating <span className="text-red-500">*</span>
            </label>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2 sm:gap-3 justify-start">
                  {renderStars(field.value, field.onChange)}
                </div>
              )}
            />
            {errors.rating && (
              <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>
            )}
          </div>

          {/* Review Text */}
          <div className="space-y-3">
            <label className="text-base sm:text-lg font-semibold text-gray-800">
              Your Review <span className="text-red-500">*</span>
            </label>
            <Controller
              name="review"
              control={control}
              render={({ field }) => (
                <Textarea
                  placeholder={`Share your experience with ${productData.name}...`}
                  {...field}
                  rows={5}
                  className="w-full resize-none rounded-xl border-gray-300 focus:border-red-500 focus:ring-4 focus:ring-red-100 text-base placeholder:text-gray-400 px-5 py-4"
                />
              )}
            />
            {errors.review && (
              <p className="text-red-500 text-sm mt-1">{errors.review.message}</p>
            )}
          </div>

          {/* Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-base sm:text-lg font-semibold text-gray-800">
                Name <span className="text-red-500">*</span>
              </label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    {...field}
                    className="w-full rounded-xl border-gray-300 focus:border-red-500 focus:ring-4 focus:ring-red-100 h-12 px-5 text-base"
                  />
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-base sm:text-lg font-semibold text-gray-800">
                Email <span className="text-red-500">*</span>
              </label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                    className="w-full rounded-xl border-gray-300 focus:border-red-500 focus:ring-4 focus:ring-red-100 h-12 px-5 text-base"
                  />
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Save Info Checkbox */}
          <div className="flex items-start gap-4">
            <Controller
              name="saveInfo"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="save-info"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(!!checked)}
                  className="mt-1 w-5 h-5 rounded border-gray-400 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                />
              )}
            />
            <label
              htmlFor="save-info"
              className="text-sm sm:text-base text-gray-600 leading-relaxed cursor-pointer"
            >
              Save my name and email for the next time I leave a review.
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={createReviewMutation.isPending}
              className="w-full md:w-auto min-w-[200px] bg-red-600 hover:bg-red-700 text-white font-semibold text-lg px-10 py-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {createReviewMutation.isPending ? "Submitting Review..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerReviewsForm;