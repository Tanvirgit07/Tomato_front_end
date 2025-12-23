/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Heart, Minus, Plus, Star } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// 🟢 Autoplay plugin import
import Autoplay from "embla-carousel-autoplay";
import { Skeleton } from "@/components/ui/skeleton";

export default function BestSellingProduct() {
  const [isVisible, setIsVisible] = useState(false);
  const session = useSession();
  const user = session?.data?.user as any;
  const userId = user?.id;
  const queryClient = useQueryClient();

  // ✅ Fetch Best Selling Products
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ["best-product"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/bestsell/bestsellproduct`
      );
      if (!res.ok) throw new Error("Failed to fetch best-selling products");
      return res.json();
    },
  });

  // ✅ Fetch Cart
  const { data: cartData } = useQuery({
    queryKey: ["cart", userId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/cart/cartuser/${userId}`
      );
      if (!res.ok) throw new Error("Failed to fetch cart");
      return res.json();
    },
    enabled: !!userId,
  });

  // ✅ Fetch Wishlist
  const { data: wishlistData } = useQuery({
    queryKey: ["wishlist", userId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/wishlist/getwishlist/${userId}`
      );
      if (!res.ok) throw new Error("Failed to fetch wishlist");
      return res.json();
    },
    enabled: !!userId,
  });
  const wishlist = wishlistData?.data || [];

  // ✅ Add to Cart
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
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
    onError: (error: any) => toast.error(error.message),
  });

  // ✅ Update Cart Quantity
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

  // ✅ Add to Wishlist
  const addToWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/wishlist/addwishlist/${userId}/${productId}`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
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

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (isError)
    return (
      <div className="flex justify-center items-center h-64 text-base sm:text-lg font-semibold text-red-500 px-4">
        Failed to load best-selling products.
      </div>
    );

  return (
    <section className="py-6 sm:py-8 md:py-10 lg:py-12 xl:py-16 px-4 sm:px-6 lg:px-8 container mx-auto">
      <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-16">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight px-4">
          Best Selling Products
        </h2>
        <p className="mt-2 sm:mt-3 text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
          Discover the top-selling items that everyone is loving — popular,
          trending, and highly recommended by our community.
        </p>
      </div>

      {isLoading ? (
        // 🟢 Skeleton Carousel
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden p-3 sm:p-4 animate-pulse flex flex-col gap-3"
            >
              {/* Image Skeleton */}
              <Skeleton className="w-full h-48 sm:h-56 md:h-64 lg:h-72 rounded-xl sm:rounded-2xl bg-gray-300" />
              {/* Badge Skeleton */}
              <Skeleton className="w-16 sm:w-20 h-4 sm:h-5 rounded-full bg-gray-200 absolute top-3 sm:top-4 right-3 sm:right-4" />
              {/* Heart Skeleton */}
              <Skeleton className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 absolute top-3 sm:top-4 left-3 sm:left-4" />
              {/* Title Skeleton */}
              <Skeleton className="w-3/4 h-5 sm:h-6 rounded-md bg-gray-300 mt-2 sm:mt-3" />
              {/* Price Skeleton */}
              <Skeleton className="w-1/2 h-4 sm:h-5 rounded-md bg-gray-300" />
              {/* Add to Cart Skeleton */}
              <Skeleton className="w-full h-9 sm:h-10 rounded-xl sm:rounded-2xl bg-gray-300" />
            </div>
          ))}
        </div>
      ) : products?.data?.length === 0 ? (
        <div className="flex justify-center items-center h-48 sm:h-56 md:h-64 bg-gray-100 rounded-xl sm:rounded-2xl mx-4">
          <p className="text-gray-500 text-base sm:text-lg md:text-xl font-semibold px-4 text-center">
            No Products Found 😔
          </p>
        </div>
      ) : (
        <div className="relative px-8 sm:px-10 md:px-12 lg:px-14">
          <Carousel
            opts={{ align: "start", loop: true }}
            plugins={[Autoplay({ delay: 3000, stopOnInteraction: true })]}
            className="w-full"
          >
            <CarouselContent className="-ml-2 sm:-ml-3 md:-ml-4">
              {products?.data
                ?.filter((product: any) => product.status === "approved")
                .map((product: any, index: number) => {
                  const cartItem = cartData?.data?.find(
                    (item: any) => item.productId._id === product._id
                  );
                  const isWishlisted = wishlist.some(
                    (item: any) => item.productId._id === product._id
                  );

                  return (
                    <CarouselItem
                      key={product._id}
                      className="pl-2 sm:pl-3 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                    >
                      {/* 🟢 Product Card */}
                      <div
                        className={`group relative bg-white rounded-2xl sm:rounded-3xl transition-all duration-500 transform hover:-translate-y-1 sm:hover:-translate-y-2 overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl ${
                          isVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                        }`}
                        style={{ transitionDelay: `${index * 100}ms` }}
                      >
                        {/* Product Image */}
                        <div className="relative overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                          />

                          {/* Sales Badge */}
                          {product.sales > 0 && (
                            <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold shadow-lg bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-black border border-yellow-200">
                              <Star size={12} className="sm:w-3.5 sm:h-3.5 text-black animate-spin-slow" />
                              <span className="hidden xs:inline">{product.sales} Sold</span>
                              <span className="xs:hidden">{product.sales}</span>
                            </div>
                          )}

                          {/* Wishlist Heart */}
                          <div
                            className={`absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 z-10 flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full cursor-pointer shadow-md transition-all duration-300 ${
                              isWishlisted
                                ? "bg-red-100 hover:bg-red-200"
                                : "bg-white hover:bg-red-50"
                            }`}
                            onClick={() => {
                              if (!isWishlisted) {
                                addToWishlistMutation.mutate(product._id);
                              } else {
                                toast.info("Product already in wishlist");
                              }
                            }}
                          >
                            <Heart
                              size={18}
                              className={`sm:w-5 sm:h-5 md:w-[22px] md:h-[22px] transition-all duration-300 ${
                                isWishlisted
                                  ? "text-red-500 fill-red-500 scale-110"
                                  : "text-red-500 hover:scale-110"
                              }`}
                            />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-3 sm:p-4 md:p-5 lg:p-6 space-y-3 sm:space-y-4">
                          <div>
                            <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                              {product.name}
                            </h3>
                          </div>

                          {/* Price + Cart */}
                          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 xs:gap-2 pt-2">
                            <div className="space-y-0.5 sm:space-y-1">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                  ${product.discountPrice?.toFixed(2)}
                                </span>
                                <span className="text-slate-400 line-through text-xs sm:text-sm">
                                  ${product.price?.toFixed(2)}
                                </span>
                              </div>
                              <div className="text-green-600 text-xs font-medium">
                                Save $
                                {(product.price - product.discountPrice).toFixed(2)}
                              </div>
                            </div>

                            {/* Cart Controls */}
                            {cartItem ? (
                              <div className="flex items-center gap-1.5 sm:gap-2">
                                <button
                                  onClick={() =>
                                    updateQuantityMutation.mutate({
                                      productId: product._id,
                                      action: "decrement",
                                    })
                                  }
                                  className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded hover:bg-red-600 transition-colors"
                                >
                                  <Minus size={14} className="sm:w-4 sm:h-4" />
                                </button>
                                <span className="text-sm sm:text-base font-medium min-w-[20px] sm:min-w-[24px] text-center">{cartItem.quantity}</span>
                                <button
                                  onClick={() =>
                                    updateQuantityMutation.mutate({
                                      productId: product._id,
                                      action: "increment",
                                    })
                                  }
                                  className="bg-green-500 text-white px-2 sm:px-3 py-1 rounded hover:bg-green-600 transition-colors"
                                >
                                  <Plus size={14} className="sm:w-4 sm:h-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addToCartMutation.mutate(product._id)}
                                className="bg-gradient-to-r from-orange-500 to-red-400 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium hover:from-orange-600 hover:to-red-500 transition-all duration-300 shadow-md hover:shadow-lg whitespace-nowrap"
                              >
                                Add to Cart
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  );
                })}
            </CarouselContent>

            {/* Navigation Arrows */}
            <CarouselPrevious className="absolute -left-4 sm:-left-6 md:-left-8 top-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-red-400 text-white w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full shadow-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 border-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2" />
            <CarouselNext className="absolute -right-4 sm:-right-6 md:-right-8 top-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-red-400 text-white w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full shadow-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 border-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2" />
          </Carousel>
        </div>
      )}
    </section>
  );
}