/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import Image from "next/image";
import { Heart, Eye, Minus, Plus, X } from "lucide-react";
import { toast } from "sonner";

function Wishlists() {
  const session = useSession();
  const user = session?.data?.user as any;
  const userId = user?.id;
  const queryClient = useQueryClient();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedToCart, setAddedToCart] = useState<Record<string, boolean>>({});

  // Get wishlist
  const {
    data: wishlistData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["wishlist", userId],
    queryFn: async () => {
      if (!userId) return [];
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/wishlist/getwishlist/${userId}`
      );
      if (!res.ok) throw new Error("Failed to fetch wishlist");
      return res.json();
    },
    enabled: !!userId,
  });

  // Remove from wishlist mutation
  const removeFromWishlistMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/wishlist/deletewishlist/${userId}/${itemId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to remove from wishlist");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist", userId] });
      toast.success("Removed from wishlist!");
    },
    onError: () => {
      toast.error("Failed to remove from wishlist");
    },
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/cart/addtocart/${productId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            productId,
            quantity,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to add to cart");
      return res.json();
    },
    onSuccess: (_data, variables) => {
      setAddedToCart((prev) => ({ ...prev, [variables.productId]: true }));
      toast.success("Added to cart!");
    },
    onError: () => {
      toast.error("Failed to add to cart");
    },
  });

  const wishlist = wishlistData?.data || [];

  const getQuantity = (productId: string) => quantities[productId] || 1;

  const updateQuantity = (
    productId: string,
    newQuantity: number,
    stock: number
  ) => {
    if (newQuantity >= 1 && newQuantity <= stock) {
      setQuantities((prev) => ({ ...prev, [productId]: newQuantity }));
    }
  };

  const handleRemoveFromWishlist = (itemId: string) => {
    removeFromWishlistMutation.mutate(itemId);
  };

  const handleAddToCart = (productId: string) => {
    const quantity = getQuantity(productId);
    addToCartMutation.mutate({ productId, quantity });
  };

  const calculateDiscount = (originalPrice: number, discountPrice: number) => {
    if (discountPrice >= originalPrice) return 0;
    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  };

  // Loading skeleton
  if (session.status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="bg-gray-100 rounded-lg p-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 py-4 border-b border-gray-200"
                >
                  <div className="w-16 h-16 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">
              Error loading wishlist
            </div>
            <button
              onClick={() =>
                queryClient.invalidateQueries({
                  queryKey: ["wishlist", userId],
                })
              }
              className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!session.data?.user) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Sign in to view your wishlist
            </h2>
            <p className="text-gray-600">
              You need to be logged in to access your wishlist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main UI
  return (
    <div className="min-h-screen bg-white py-8 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          {/* Title with Heart Icon */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="h-5 w-5 md:h-6 md:w-6 text-red-500" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase tracking-wide">
              Wishlist
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-xs md:text-sm text-gray-500 max-w-md mx-auto mb-3 px-4">
            Save your favorite items here and revisit them anytime. Add to cart
            when you&apos;re ready to checkout.
          </p>
        </div>

        {/* Wishlist Content */}
        {wishlist.length === 0 ? (
          <div className="text-center py-12 md:py-16">
            <Heart className="mx-auto h-12 w-12 md:h-16 md:w-16 text-gray-300 mb-4" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-6 md:mb-8">
              Save items you love to buy them later.
            </p>
            <button
              onClick={() => (window.location.href = "/products")}
              className="bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-900 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View (hidden on mobile) */}
            <div className="hidden lg:block bg-white border border-gray-200 rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-4 px-6 py-4">
                  <div className="col-span-1">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-gray-600 rounded border-gray-300"
                    />
                  </div>
                  <div className="col-span-3 text-sm font-medium text-gray-700 uppercase tracking-wide">
                    PRODUCT
                  </div>
                  <div className="col-span-2 text-sm font-medium text-gray-700 uppercase tracking-wide">
                    QUANTITY
                  </div>
                  <div className="col-span-2 text-sm font-medium text-gray-700 uppercase tracking-wide">
                    PRICE
                  </div>
                  <div className="col-span-2 text-sm font-medium text-gray-700 uppercase tracking-wide">
                    STOCK STATUS
                  </div>
                  <div className="col-span-2 text-sm font-medium text-gray-700 uppercase tracking-wide">
                    ACTION
                  </div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {wishlist.map((item: any) => {
                  const product = item.productId;
                  const discount = calculateDiscount(
                    product.price,
                    product.discountPrice
                  );
                  const hasDiscount = discount > 0;
                  const quantity = getQuantity(product._id);

                  return (
                    <div
                      key={item._id}
                      className="grid grid-cols-12 gap-4 px-6 py-6 hover:bg-gray-50"
                    >
                      {/* Checkbox */}
                      <div className="col-span-1 flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-gray-600 rounded border-gray-300"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="col-span-3 flex items-center gap-4">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            SKU: {product._id.slice(-8)}
                          </p>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="col-span-2 flex items-center">
                        <div className="flex items-center border border-gray-300 rounded">
                          <button
                            onClick={() =>
                              updateQuantity(
                                product._id,
                                quantity - 1,
                                product.stock
                              )
                            }
                            className="p-2 hover:bg-gray-100 text-gray-600"
                            disabled={quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-4 py-2 border-x border-gray-300 text-center min-w-[60px]">
                            {quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                product._id,
                                quantity + 1,
                                product.stock
                              )
                            }
                            className="p-2 hover:bg-gray-100 text-gray-600"
                            disabled={quantity >= product.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-2 flex items-center">
                        <div>
                          {hasDiscount && (
                            <div className="text-sm text-gray-500 line-through">
                              ${product.price.toFixed(2)}
                            </div>
                          )}
                          <div className="text-lg font-medium text-red-500">
                            $
                            {hasDiscount
                              ? product.discountPrice.toFixed(2)
                              : product.price.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      {/* Stock Status */}
                      <div className="col-span-2 flex items-center">
                        {product.stock > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-sm text-gray-600">
                              {product.stock} in stock
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                            <span className="text-sm text-red-600">
                              Out of stock
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="col-span-2 flex items-center gap-2">
                        <button
                          onClick={() => handleAddToCart(product._id)}
                          disabled={
                            product.stock === 0 ||
                            addToCartMutation.isPending ||
                            addedToCart[product._id]
                          }
                          className="bg-gray-800 hover:bg-gray-900 disabled:bg-gray-300 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                        >
                          {addedToCart[product._id] ? "Added" : "Add"}
                        </button>
                        <button
                          onClick={() =>
                            (window.location.href = `/products/${product._id}`)
                          }
                          className="p-2 text-gray-400 hover:text-gray-600 border border-gray-300 rounded"
                          title="View product"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveFromWishlist(product._id)}
                          disabled={removeFromWishlistMutation.isPending}
                          className="p-2 text-gray-400 hover:text-red-600 border border-gray-300 rounded"
                          title="Remove from wishlist"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Card View (hidden on desktop) */}
            <div className="lg:hidden space-y-4">
              {wishlist.map((item: any) => {
                const product = item.productId;
                const discount = calculateDiscount(
                  product.price,
                  product.discountPrice
                );
                const hasDiscount = discount > 0;
                const quantity = getQuantity(product._id);

                return (
                  <div
                    key={item._id}
                    className="bg-white border border-gray-200 rounded-lg p-4 relative"
                  >
                    {/* Remove Button (Top Right) */}
                    <button
                      onClick={() => handleRemoveFromWishlist(product._id)}
                      disabled={removeFromWishlistMutation.isPending}
                      className="absolute top-3 right-3 p-2 text-gray-400 hover:text-red-600 bg-white border border-gray-300 rounded"
                      title="Remove from wishlist"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    {/* Product Image and Info */}
                    <div className="flex gap-4 mb-4">
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 pr-8">
                        <h3 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">
                          SKU: {product._id.slice(-8)}
                        </p>
                        {/* Stock Status */}
                        {product.stock > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-xs text-gray-600">
                              {product.stock} in stock
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                            <span className="text-xs text-red-600">
                              Out of stock
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      {hasDiscount && (
                        <div className="text-sm text-gray-500 line-through">
                          ${product.price.toFixed(2)}
                        </div>
                      )}
                      <div className="text-xl font-medium text-red-500">
                        $
                        {hasDiscount
                          ? product.discountPrice.toFixed(2)
                          : product.price.toFixed(2)}
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-700">
                        Quantity:
                      </span>
                      <div className="flex items-center border border-gray-300 rounded">
                        <button
                          onClick={() =>
                            updateQuantity(
                              product._id,
                              quantity - 1,
                              product.stock
                            )
                          }
                          className="p-2 hover:bg-gray-100 text-gray-600"
                          disabled={quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-4 py-2 border-x border-gray-300 text-center min-w-[50px]">
                          {quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              product._id,
                              quantity + 1,
                              product.stock
                            )
                          }
                          className="p-2 hover:bg-gray-100 text-gray-600"
                          disabled={quantity >= product.stock}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(product._id)}
                        disabled={
                          product.stock === 0 ||
                          addToCartMutation.isPending ||
                          addedToCart[product._id]
                        }
                        className="flex-1 bg-gray-800 hover:bg-gray-900 disabled:bg-gray-300 text-white px-4 py-2.5 rounded text-sm font-medium transition-colors"
                      >
                        {addedToCart[product._id] ? "Added to Cart" : "Add to Cart"}
                      </button>
                      <button
                        onClick={() =>
                          (window.location.href = `/products/${product._id}`)
                        }
                        className="p-2.5 text-gray-400 hover:text-gray-600 border border-gray-300 rounded"
                        title="View product"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Wishlists;