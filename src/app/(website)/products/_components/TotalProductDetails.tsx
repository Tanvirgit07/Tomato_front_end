"use client";

import React from "react";
import ProductDetailsImage from "./ProductDetaislImage";
import ProductDetailsHeader from "./ProductPageHeader";
import ProductDetailsContent from "./ProductDetailsContent";
import { useParams } from "next/navigation";
import CustomerReviewsForm from "./CustomerReviewsForm";
import { useQuery } from "@tanstack/react-query";
import AllReview from "./AllReview";
import TotalReviews from "./TotalReviews";

function TotalProductDetails() {
  const { id } = useParams();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/food/getSingleFood/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch product");
      }

      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Loading product details...</div>
      </div>
    );
  }

  if (isError || !product?.data) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-red-600">
          Failed to load product details
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ProductDetailsHeader />
      
      {/* Product Image */}
      <div className="container mx-auto px-4">
        <ProductDetailsImage productId={id} productData={product.data} />
      </div>

      {/* Product Description/Content */}
      <div className="container mx-auto px-4">
        <ProductDetailsContent productData={product.data} />
      </div>

      {/* Reviews Form + Total Reviews Summary */}
      <div className="container mx-auto lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
          {/* Review Form - Mobile এ full width, Desktop এ left side */}
          <div className="lg:col-span-7 xl:col-span-8">
            <CustomerReviewsForm productData={product.data} />
          </div>

          {/* Total Reviews Summary - Mobile এ full width (form এর নিচে), Desktop এ right side */}
          <div className="lg:col-span-5 xl:col-span-4 px-4">
            <TotalReviews productId={id} />
          </div>
        </div>
      </div>

      {/* All Reviews Carousel Section */}
      <div className="pb-12">
        <AllReview />
      </div>
    </div>
  );
}

export default TotalProductDetails;