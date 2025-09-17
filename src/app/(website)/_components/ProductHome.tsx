/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ApiResponse, Product } from "../../../../types/product";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Heart, Minus, Plus } from "lucide-react";

type ProductHomeProps = {
  activeCategory: string;
};

const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <span key={i} className={i < rating ? "text-amber-500" : "text-gray-300"}>
        ★
      </span>
    );
  }
  return <div className="flex">{stars}</div>;
};

export default function ProductHome({ activeCategory }: ProductHomeProps) {
  const [isVisible, setIsVisible] = useState(false);
  const session = useSession();
  const user = session?.data?.user as any;
  const userId = user?.id;
  const queryClient = useQueryClient();

  // get all products
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery<ApiResponse>({
    queryKey: ["product"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/food/getAllFood`
      );
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  // get cart
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

  // add to cart
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

  // update quantity
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

  // wishlist
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

  // add to wishlist
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

  const filteredProducts =
    activeCategory === "All"
      ? products?.data || []
      : products?.data?.filter(
          (item: Product) =>
            item.category?.name?.toLowerCase() === activeCategory.toLowerCase()
        ) || [];

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64 text-lg font-semibold">
        Loading products...
      </div>
    );
  if (isError)
    return (
      <div className="flex justify-center items-center h-64 text-lg font-semibold text-red-500">
        Failed to load products.
      </div>
    );

  return (
    <div className="py-8 sm:py-12 lg:py-3">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-8 sm:mb-12 lg:mb-16 text-center tracking-tight">
        Top Products Near You
      </h2>

      {filteredProducts.length === 0 ? (
        <div className="flex justify-center items-center h-64 sm:h-72 lg:h-80 bg-gray-100 rounded-2xl shadow-lg">
          <p className="text-gray-500 text-lg sm:text-xl font-semibold">
            No Products Found 😔
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product: Product, index: number) => {
            const cartItem = cartData?.data?.find(
              (item: any) => item.productId._id === product._id
            );
            const isWishlisted = wishlist.some(
              (item: any) => item.productId._id === product._id
            );

            return (
              <div
                key={product._id}
                className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-slate-100 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Category badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-white/90 backdrop-blur-sm text-slate-700 px-3 py-1 rounded-full text-xs font-medium">
                      {product.category?.name}
                    </div>
                  </div>

                  {/* Wishlist Heart */}
                  <div
                    className={`absolute top-4 left-4 z-10 flex items-center justify-center h-10 w-10 rounded-full cursor-pointer shadow-md transition-all duration-300 ${
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
                      size={22}
                      className={`transition-all duration-300 ${
                        isWishlisted
                          ? "text-red-500 fill-red-500 scale-110"
                          : "text-red-500 hover:scale-110"
                      }`}
                    />
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {product.name}
                    </h3>
                    <p
                      className="text-slate-600 text-sm mt-2 line-clamp-2 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    {renderStars(4)}
                    <span className="text-amber-600 font-semibold text-sm">
                      4.0
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          ${product.discountPrice.toFixed(2)}
                        </span>
                        <span className="text-slate-400 line-through text-sm">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-green-600 text-xs font-medium">
                        Save $
                        {(product.price - product.discountPrice).toFixed(2)}
                      </div>
                    </div>

                    {/* Cart Controls */}
                    {cartItem ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantityMutation.mutate({
                              productId: product._id,
                              action: "decrement",
                            })
                          }
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          <Minus size={16} />
                        </button>
                        <span>{cartItem.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantityMutation.mutate({
                              productId: product._id,
                              action: "increment",
                            })
                          }
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCartMutation.mutate(product._id)}
                        className="bg-gradient-to-r from-orange-500 to-red-400 text-white px-4 py-2 rounded-2xl text-sm font-medium"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
