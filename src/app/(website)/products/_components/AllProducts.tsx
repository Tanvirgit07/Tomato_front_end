"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Heart, Minus, Plus, Search } from "lucide-react";
import Image from "next/image";
import { ApiResponse } from "../../../../../types/product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "../../../../../types/category";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function AllProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
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
    queryKey: ["product", debouncedSearchTerm, category],
    queryFn: async () => {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_API_URL
        }/food/getAllFood?name=${encodeURIComponent(
          debouncedSearchTerm
        )}&category=${category}`
      );
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });
  const product = products?.data || [];

  // get categories
  const { data: mainCategory } = useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/category/allcategory`
      );
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
  });
  const categories = mainCategory?.data || [];

  // get cart data
  const { data: cartData } = useQuery({
    queryKey: ["cart", userId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/cart/cartuser/${userId}`
      );
      if (!res.ok) throw new Error("Failed to fetch cart");
      return res.json();
    },
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

  // get wishlist
  const { data: wishlistData } = useQuery({
    queryKey: ["wishlist", userId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/wishlist/getwishlist/${userId}`
      );
      if (!res.ok) throw new Error("Failed to fetch wishlist");
      return res.json();
    },
  });
  const wishlist = wishlistData?.data || [];
  console.log("wishlist", wishlist)

  // add to wishlist
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Our Products
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Explore our premium beauty products crafted for your unique needs.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 flex justify-between items-center">
          <div className="w-[25%]">
            <div className="relative mt-2">
              <Input
                id="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 h-[50px] rounded-2xl border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm w-full"
              />
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Select onValueChange={(value) => setCategory(value)}>
              <SelectTrigger className="w-[230px]">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((item: Category) => (
                  <SelectItem key={item._id} value={item.categoryName}>
                    {item.categoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading && <p className="text-center">Loading products...</p>}
        {isError && (
          <p className="text-center text-red-500">Failed to fetch products</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {product.map((p) => {
            const cartItem = cartData?.data?.find(
              (item: any) => item.productId._id === p._id
            );

            return (
              <div
                key={p._id}
                className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100"
              >
                {/* Wishlist Heart */}
                <div
                  className={`
                    flex items-center justify-center 
                    h-10 w-10 rounded-full 
                    transition-all duration-300 
                    shadow-md
                    cursor-pointer
                    ${
                      wishlist.some((item: any) => item.productId._id === p._id)
                        ? "bg-red-100 hover:bg-red-200"
                        : "bg-white hover:bg-red-50"
                    }
                  `}
                  onClick={() => {
                    if (
                      !wishlist.some((item: any) => item.productId._id === p._id)
                    ) {
                      addToWishlistMutation.mutate(p._id);
                    } else {
                      toast.info("Product is already in your wishlist");
                    }
                  }}
                >
                  <Heart
                    size={24}
                    className={`
                      transition-all duration-300
                      ${
                        wishlist.some((item: any) => item.productId._id === p._id)
                          ? "text-red-500 fill-red-500 scale-110"
                          : "text-red-500 hover:scale-110"
                      }
                    `}
                  />
                </div>

                {/* Image */}
                <div className="relative overflow-hidden">
                  <Image
                    width={400}
                    height={400}
                    src={p.image}
                    alt={p.name}
                    className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-slate-800">{p.name}</h3>
                  <p
                    className="text-slate-600 text-sm mt-2"
                    dangerouslySetInnerHTML={{ __html: p.description }}
                  />
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-indigo-600">
                        ${p.discountPrice.toFixed(2)}
                      </span>
                      <span className="text-slate-400 line-through text-sm">
                        ${p.price.toFixed(2)}
                      </span>
                    </div>

                    {/* Cart Button / Quantity Controls */}
                    {cartItem ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantityMutation.mutate({
                              productId: p._id,
                              action: "decrement",
                            })
                          }
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          <Minus />
                        </button>
                        <span>{cartItem.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantityMutation.mutate({
                              productId: p._id,
                              action: "increment",
                            })
                          }
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          <Plus />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCartMutation.mutate(p._id)}
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
      </div>
    </main>
  );
}
