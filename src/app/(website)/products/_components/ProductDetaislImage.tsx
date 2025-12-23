/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Heart, ShoppingCart, Plus, Minus, Tag, Package, Star } from "lucide-react";

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

  // Calculate discount percentage
  const discountPercentage = displayData.originalPrice && displayData.originalPrice !== displayData.price
    ? Math.round(((displayData.originalPrice - displayData.price) / displayData.originalPrice) * 100)
    : 0;

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
    <div className="w-full lg:mt-20 md:mt-16 mt-10 lg:mb-10 md:mb-8 mb-5">
      <div className="container mx-auto sm:px-6 lg:px-8 sm:py-8 lg:py-10">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 sm:gap-10 lg:gap-16">
          {/* Image Gallery */}
          <div className="flex flex-col gap-4 sm:gap-5 w-full lg:w-1/2 lg:max-w-[550px]">
            <Card className="overflow-hidden w-full border-2 border-gray-200 duration-300 relative group">
              {discountPercentage > 0 && (
                <Badge className="absolute top-4 left-4 z-10 bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1.5 text-sm font-bold shadow-lg animate-pulse">
                  <Tag className="w-4 h-4 mr-1 inline" />
                  {discountPercentage}% OFF
                </Badge>
              )}
              <CardContent className="p-0">
                <div className="relative w-full aspect-square sm:aspect-video lg:aspect-[4/3] bg-white">
                  <Image
                    fill
                    src={displayData.images[selectedImage].src}
                    alt={displayData.images[selectedImage].alt}
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 550px"
                    priority
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-row gap-2.5 sm:gap-3 lg:gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-100">
              {displayData.images.map((image) => (
                <Card
                  key={image.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 flex-shrink-0 border-2 ${
                    selectedImage === image.id 
                      ? "ring-4 ring-blue-500 border-blue-500 shadow-lg" 
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => setSelectedImage(image.id)}
                >
                  <CardContent className="p-1">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white">
                      <Image
                        fill
                        src={image.src}
                        alt={image.alt}
                        className="object-contain p-1 rounded"
                        sizes="(max-width: 640px) 64px, (max-width: 1024px) 80px, 96px"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-5 sm:space-y-6 lg:space-y-7 flex-1 w-full lg:w-1/2">
            {/* Title */}
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight break-words bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                {displayData.title}
              </h1>
              
              {/* Rating Stars (Mock) */}
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-600 font-medium">(4.5 Rating)</span>
              </div>
            </div>

            {/* Features/Categories */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-none">
              <CardContent className="p-4 sm:p-5">
                <div className="space-y-3">
                  {displayData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 group">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Package className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm sm:text-base lg:text-lg text-gray-800 font-semibold break-words">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Price Section */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
              <CardContent className="p-5 sm:p-6">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 font-medium">Price</p>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-green-600">
                      ${displayData.price.toFixed(2)}
                    </span>
                    {displayData.originalPrice &&
                      displayData.originalPrice !== displayData.price && (
                        <div className="flex flex-col">
                          <span className="text-lg sm:text-xl lg:text-2xl text-gray-400 line-through font-semibold">
                            ${displayData.originalPrice.toFixed(2)}
                          </span>
                          <span className="text-xs sm:text-sm text-green-600 font-bold">
                            You save ${(displayData.originalPrice - displayData.price).toFixed(2)}!
                          </span>
                        </div>
                      )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions: Wishlist & Cart */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                {/* Wishlist Button */}
                <Button
                  variant="outline"
                  size="lg"
                  className={`transition-all duration-300 border-2 group hover:scale-105 ${
                    isWishlisted
                      ? "bg-red-50 border-red-300 text-red-600 hover:bg-red-100"
                      : "border-gray-300 hover:border-red-300 hover:bg-red-50"
                  }`}
                  onClick={() => {
                    if (!isWishlisted) addToWishlistMutation.mutate(displayData.id);
                    else toast.info("Already in wishlist");
                  }}
                >
                  <Heart
                    className={`w-5 h-5 mr-2 transition-all duration-300 ${
                      isWishlisted ? "fill-red-500 text-red-500" : "group-hover:fill-red-400"
                    }`}
                  />
                  <span className="font-semibold">
                    {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                  </span>
                </Button>

                {/* Cart Actions */}
                {cartItem ? (
                  <Card className="flex-1 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between gap-3">
                        <Button
                          size="icon"
                          onClick={() =>
                            updateQuantityMutation.mutate({
                              productId: displayData.id,
                              action: "decrement",
                            })
                          }
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg h-10 w-10 shadow-md hover:scale-110 transition-all"
                        >
                          <Minus className="w-5 h-5" />
                        </Button>
                        
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-gray-600 font-medium">Quantity</span>
                          <span className="text-2xl font-bold text-gray-900">
                            {cartItem.quantity}
                          </span>
                        </div>
                        
                        <Button
                          size="icon"
                          onClick={() =>
                            updateQuantityMutation.mutate({
                              productId: displayData.id,
                              action: "increment",
                            })
                          }
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg h-10 w-10 shadow-md hover:scale-110 transition-all"
                        >
                          <Plus className="w-5 h-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Button
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-4 sm:py-5 lg:py-6 duration-300 text-base sm:text-lg lg:text-xl"
                    onClick={() => addToCartMutation.mutate(displayData.id)}
                  >
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                    Add to Cart
                  </Button>
                )}
              </div>

              {/* Additional Info */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Badge variant="outline" className="text-xs sm:text-sm px-3 py-1.5 border-green-300 text-green-700 bg-green-50">
                  ✓ In Stock
                </Badge>
                <Badge variant="outline" className="text-xs sm:text-sm px-3 py-1.5 border-blue-300 text-blue-700 bg-blue-50">
                  🚚 Free Shipping
                </Badge>
                <Badge variant="outline" className="text-xs sm:text-sm px-3 py-1.5 border-purple-300 text-purple-700 bg-purple-50">
                  🔒 Secure Payment
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsImage;