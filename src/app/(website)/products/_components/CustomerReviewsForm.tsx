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
    setValue,
    watch,
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

  // Submit Handler
  const onSubmit = (formData: ReviewFormData) => {
    const reviewData = {
      user: userId,
      food: productData._id,
      rating: formData.rating,
      comment: formData.review.trim(),
    };
    createReviewMutation.mutate(reviewData);
  };

  // Render stars
  const renderStars = (value: number, onChange: (val: number) => void) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isActive = i <= (hoveredRating || value);
      stars.push(
        <button
          key={i}
          type="button"
          aria-label={`${i} star`}
          className="focus:outline-none"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHoveredRating(i)}
          onMouseLeave={() => setHoveredRating(0)}
        >
          <Star
            className={`w-5 h-5 transition-colors duration-200 ${
              isActive
                ? "fill-yellow-400 text-yellow-400"
                : "fill-none text-gray-300 hover:text-yellow-400"
            }`}
          />
        </button>
      );
    }
    return stars;
  };

  return (
    <div className="container mx-auto px-4 bg-white lg:mb-[58px] md:mb-[43px] mb-[38px]">
      <div className="space-y-6">
        <h1 className="lg:text-[32px] md:text-[28px] text-[20px] font-semibold leading-[120%] mb-8">
          Customer Reviews
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Rating */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Your Rating *
            </label>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-1">
                  {renderStars(field.value, field.onChange)}
                </div>
              )}
            />
            {errors.rating && (
              <p className="text-red-500 text-sm">{errors.rating.message}</p>
            )}
          </div>

          {/* Review */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Your Review *
            </label>
            <Controller
              name="review"
              control={control}
              render={({ field }) => (
                <Textarea
                  placeholder={`Share your thoughts about ${productData.name}...`}
                  {...field}
                  className="min-h-[120px] resize-none border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                />
              )}
            />
            {errors.review && (
              <p className="text-red-500 text-sm">{errors.review.message}</p>
            )}
          </div>

          {/* Name + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Name *
              </label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Your Name"
                    {...field}
                    className="border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 h-[51px]"
                  />
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Email *
              </label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    type="email"
                    placeholder="Your Email"
                    {...field}
                    className="border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 h-[51px]"
                  />
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Save Info */}
          <div className="flex items-center space-x-2">
            <Controller
              name="saveInfo"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="save-info"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(!!checked)}
                  className="border-gray-300 w-[22px] h-[22px]"
                />
              )}
            />
            <label
              htmlFor="save-info"
              className="text-base text-gray-700 cursor-pointer"
            >
              Save my name, email, and website in this browser for the next time
              I comment.
            </label>
          </div>

          {/* Submit */}
          <div>
            <Button
              type="submit"
              className="bg-red-600 h-[51px] hover:bg-red-700 text-white text-lg px-10 rounded-md font-medium transition-colors duration-200"
              disabled={createReviewMutation.isPending}
            >
              {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerReviewsForm;
