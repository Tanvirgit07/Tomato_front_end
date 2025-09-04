"use client";

import React from "react";
import ProductDetailsImage from "./ProductDetaislImage";
import ProductDetailsHeader from "./ProductPageHeader";
import ProductDetailsContent from "./ProductDetailsContent";
import { useParams } from "next/navigation";
import CustomerReviewsForm from "./CustomerReviewsForm";
import { useQuery } from "@tanstack/react-query";
// import MyReviews from './MyReviews'
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
    <div>
      <ProductDetailsHeader />
      <ProductDetailsImage productId={id} productData={product.data} />
      <ProductDetailsContent productData={product.data} />
      <div className="flex justify-between items-center gap-10 container mx-auto">
        <div className="w-[55%]">
          <CustomerReviewsForm productData={product.data} />
        </div>
        <div className="flex-1">
          <TotalReviews productId={id} />
        </div>
      </div>
      <div className="flex justify-between items-center gap-5 container mx-auto">
        {/* <div className='w-[30%] border'>
          <MyReviews productId={Array.isArray(id) ? id[0] : id} />
        </div> */}
        <div className="flex-1">
          <AllReview />
        </div>
      </div>
    </div>
  );
}

export default TotalProductDetails;
