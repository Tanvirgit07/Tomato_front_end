"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";
import { ApiResponse } from "../../../../../types/product";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "../../../../../types/category";

export default function AllProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

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

  const { data: mainCategory } = useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/category/allcategory`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Faild to fetch Data");
      }
      return res.json();
    },
  });
  const categories = mainCategory?.data || [];

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

        {/* Search Input */}
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
            <div>
              <Select onValueChange={(value) => setCategory(value)}>
                <SelectTrigger className="w-[230px]">
                  <SelectValue placeholder="Select Compamy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
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
        </div>

        {/* Product Grid */}
        {isLoading && <p className="text-center">Loading products...</p>}
        {isError && (
          <p className="text-center text-red-500">Failed to fetch products</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {product.map((p, index) => (
            <div
              key={p._id}
              className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-slate-100 opacity-100 translate-y-0`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <Image
                  width={400}
                  height={400}
                  src={p.image}
                  alt={p.name}
                  className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm text-slate-700 px-3 py-1 rounded-full text-xs font-medium">
                    {p.category?.name}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {p.name}
                  </h3>
                  <p
                    className="text-slate-600 text-sm mt-2 line-clamp-2 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: p.description }}
                  />
                </div>
                {/* Price */}
                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        ${p.discountPrice.toFixed(2)}
                      </span>
                      <span className="text-slate-400 line-through text-sm">
                        ${p.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-green-600 text-xs font-medium">
                      Save ${(p.price - p.discountPrice).toFixed(2)}
                    </div>
                  </div>

                  <button className="bg-gradient-to-r from-orange-500 to-red-400 hover:from-indigo-600 hover:to-purple-600 text-white px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
