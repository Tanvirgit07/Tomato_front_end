"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

function ProductDetails() {
  const params = useParams();
  const productId = params.id;

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/food/getSingleFood/${productId}`,
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
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
      </div>
    );
  }

  if (isError || !product?.data) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-red-500 text-lg">
        Failed to load product details.
      </div>
    );
  }

  const data = product.data;

  return (
    <div className="max-w-5xl h-screen mx-auto p-6">
      <Card className="shadow-lg rounded-2xl overflow-hidden">
        <CardContent className="grid md:grid-cols-2 gap-8 p-6">
          {/* Product Image */}
          <div className="relative w-full h-[400px]">
            <Image
              src={data.image}
              alt={data.name}
              fill
              className="object-cover rounded-xl shadow-md"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-gray-800">{data.name}</h1>

            <div className="flex gap-2">
              <Badge variant="outline">{data.category?.name}</Badge>
              <Badge>{data.subCategory?.name}</Badge>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-2xl font-semibold text-green-600">
                ${data.discountPrice}
              </span>
              <span className="text-lg line-through text-gray-400">
                ${data.price}
              </span>
            </div>

            <div
              className="text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: (data.description),
              }}
            />

            <div className="mt-6 text-sm text-gray-500 space-y-1">
              <p>
                Created At:{" "}
                <span className="font-medium">
                  {new Date(data.createdAt).toLocaleDateString()}
                </span>
              </p>
              <p>
                Updated At:{" "}
                <span className="font-medium">
                  {new Date(data.updatedAt).toLocaleDateString()}
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProductDetails;
