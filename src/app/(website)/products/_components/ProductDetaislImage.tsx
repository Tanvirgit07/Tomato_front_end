/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";

interface SubImage {
  url: string;
  publicId: string;
  _id: string;
}

interface ProductData {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  image: string;
  subImages: SubImage[];
  category: {
    _id: string;
    name: string;
  };
  subCategory: {
    _id: string;
    name: string;
  };
}

interface ProductDetailsImageProps {
  productId: string | string[];
  productData: ProductData;
}

const ProductDetailsImage: React.FC<ProductDetailsImageProps> = ({
  productId,
  productData,
}) => {
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const session = useSession();
  const user = session?.data?.user as any;
  const userId = user?.id;

  const queryClient = useQueryClient();

  const displayData = {
    id: Array.isArray(productId) ? productId[0] : productId,
    title: productData.name || "Unnamed Product",
    price: productData.discountPrice || productData.price || 0,
    originalPrice: productData.price,
    images: [
      { id: 0, src: productData.image, alt: `${productData.name} - Main View` },
      ...productData.subImages.map((img, index) => ({
        id: index + 1,
        src: img.url,
        alt: `${productData.name} - View ${index + 1}`,
      })),
    ],
    features: [
      `Category: ${productData.category?.name || "General"}`,
      `Sub-Category: ${productData.subCategory?.name || "Standard"}`,
    ],
  };

  // Fetch Cart Data
  const { data: cartData } = useQuery({
    queryKey: ["cart", userId],
    enabled: !!userId,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/cart/cartuser/${userId}`
      );
      if (!res.ok) throw new Error("Failed to fetch cart");
      return res.json();
    },
  });

  // Fetch Wishlist
  const { data: wishlistData } = useQuery({
    queryKey: ["wishlist", userId],
    enabled: !!userId,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/wishlist/getwishlist/${userId}`
      );
      if (!res.ok) throw new Error("Failed to fetch wishlist");
      return res.json();
    },
  });

  const wishlist = wishlistData?.data || [];
  const cartItem = cartData?.data?.find(
    (item: any) => item.productId._id === displayData.id
  );
  const isWishlisted = wishlist.some(
    (item: any) => item.productId._id === displayData.id
  );

  // Add to Cart
  const addToCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/cart/addtocart/${userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        }
      );
      if (!res.ok) throw new Error("Failed to add to cart");
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Added to cart!");
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
    onError: (error: any) => toast.error(error.message),
  });

  // Update Quantity
  const updateQuantityMutation = useMutation({
    mutationFn: async ({
      productId,
      action,
    }: {
      productId: string;
      action: "increment" | "decrement";
    }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/cart/update/${userId}/${productId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        }
      );
      if (!res.ok) throw new Error("Failed to update quantity");
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
    onError: (error: any) => toast.error(error.message),
  });

  // Wishlist Mutation
  const addToWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/wishlist/addwishlist/${userId}/${productId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) throw new Error("Failed to add to wishlist");
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: ["wishlist", userId] });
    },
    onError: (error: any) => toast.error(error.message),
  });

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-white lg:mt-[83px] md:mt-[60px] mt-[40px] lg:mb-[40px] md:mb-[30px] mb-[20px]">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 sm:gap-8 lg:gap-[100px]">
        {/* Image Gallery */}
        <div className="flex flex-col gap-3 sm:gap-4 w-full sm:max-w-[600px]">
          <Card className="overflow-hidden w-full h-full">
            <CardContent className="p-0">
              <Image
                width={400}
                height={400}
                src={displayData.images[selectedImage].src}
                alt={displayData.images[selectedImage].alt}
                className="w-full h-[200px] sm:h-[300px] object-cover"
              />
            </CardContent>
          </Card>

          <div className="flex flex-row gap-[20px] overflow-x-auto">
            {displayData.images.map((image) => (
              <Card
                key={image.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md flex-shrink-0 ${
                  selectedImage === image.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setSelectedImage(image.id)}
              >
                <CardContent className="p-0">
                  <Image
                    width={300}
                    height={300}
                    src={image.src}
                    alt={image.alt}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6 flex-1 w-full">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            {displayData.title}
          </h1>

          {/* Features */}
          <div className="space-y-2">
            {displayData.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="w-3 h-3 bg-blue-500 rounded-full inline-block"></span>
                <span className="text-base sm:text-lg text-gray-700 font-medium">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Price */}
          <div className="py-4">
            <div className="flex items-center gap-4">
              <span className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                ${displayData.price.toFixed(2)}
              </span>
              {displayData.originalPrice &&
                displayData.originalPrice !== displayData.price && (
                  <span className="text-lg sm:text-xl text-gray-400 line-through">
                    ${displayData.originalPrice.toFixed(2)}
                  </span>
                )}
            </div>
          </div>

          {/* Actions: Wishlist & Cart */}
          <div className="flex items-center gap-5">
            {/* Wishlist */}
            <div
              className={`cursor-pointer p-3 rounded-full transition-transform duration-300 ${
                isWishlisted
                  ? "bg-red-100 scale-110 hover:bg-red-200"
                  : "bg-gray-100 hover:scale-110"
              } shadow-md`}
              onClick={() => {
                if (!isWishlisted) addToWishlistMutation.mutate(displayData.id);
                else toast.info("Already in wishlist");
              }}
            >
              <Heart
                size={26}
                className={`transition-all duration-300 ${
                  isWishlisted ? "text-red-500 fill-red-500" : "text-gray-500"
                }`}
              />
            </div>

            {/* Add to Cart / Quantity Controls */}
            {cartItem ? (
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg shadow-md">
                <button
                  onClick={() =>
                    updateQuantityMutation.mutate({
                      productId: displayData.id,
                      action: "decrement",
                    })
                  }
                  className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition"
                >
                  -
                </button>
                <span className="font-semibold px-2">{cartItem.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantityMutation.mutate({
                      productId: displayData.id,
                      action: "increment",
                    })
                  }
                  className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600 transition"
                >
                  +
                </button>
              </div>
            ) : (
              <Button
                className="bg-gradient-to-r w-full from-blue-500 to-purple-600 text-white font-semibold py-3 px-7 rounded-lg hover:scale-105 transition-transform shadow-lg"
                onClick={() => addToCartMutation.mutate(displayData.id)}
              >
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsImage;
