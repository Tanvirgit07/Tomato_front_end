"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter } from "lucide-react";
import Image from "next/image";
import { ApiResponse } from "../../../../../types/product";
import { useQuery } from "@tanstack/react-query";

export default function AllProducts() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const {
    data: products,
    isLoading,
    isError,
  } = useQuery<ApiResponse>({
    queryKey: ["product"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/food/getAllFood`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      return res.json();
    },
  });

  const product = products?.data || [];
  console.log(product);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 rounded-full mb-4">
            <span className="text-indigo-600 font-medium text-sm">
              Shop Now
            </span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
            Our Products
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Explore our premium beauty products crafted for your unique needs.
          </p>
        </div>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <div className="lg:w-1/4">
            <div className="lg:hidden mb-4">
              <Button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full bg-gradient-to-r from-orange-500 to-red-400 hover:from-indigo-600 hover:to-purple-600 text-white rounded-2xl"
              >
                <Filter className="w-5 h-5 mr-2" />
                {isFilterOpen ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>

            <Card
              className={`lg:block ${
                isFilterOpen ? "block" : "hidden"
              } bg-white rounded-3xl shadow-lg border border-slate-100 p-6`}
            >
              <h2 className="text-xl font-bold text-slate-800 mb-6">Filters</h2>

              {/* Search */}
              <div className="mb-6">
                <Label
                  htmlFor="search"
                  className="text-slate-800 font-semibold"
                >
                  Search
                </Label>
                <div className="relative mt-3">
                  <Input
                    id="search"
                    placeholder="Search products..."
                    className="pl-12 pr-4 h-[50px] rounded-2xl border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                </div>
              </div>

              {/* Category Filter with Select */}
              <div className="mb-6">
                <Label
                  htmlFor="category"
                  className="text-slate-800 font-semibold"
                >
                  Category
                </Label>
                <Select>
                  <SelectTrigger
                    id="category"
                    className="mt-2 !h-[50px] rounded-2xl w-full border-slate-200"
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="skin-care">Skin Care</SelectItem>
                    <SelectItem value="make-up">Make Up</SelectItem>
                    <SelectItem value="hair-care">Hair Care</SelectItem>
                    <SelectItem value="fragrance">Fragrance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Company Filter with Select */}
              <div>
                <Label
                  htmlFor="company"
                  className="text-slate-800 font-semibold"
                >
                  Company
                </Label>
                <Select>
                  <SelectTrigger
                    id="company"
                    className="mt-2 !h-[50px] rounded-2xl w-full border-slate-200"
                  >
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="glowvibe">GlowVibe</SelectItem>
                    <SelectItem value="pureluxe">PureLuxe</SelectItem>
                    <SelectItem value="beautybase">BeautyBase</SelectItem>
                    <SelectItem value="radiantcos">RadiantCos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </div>

          {/* Product Grid */}
          <div className="lg:w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {product.map((p) => {
                // Calculate discount percentage
                const discountPercentage = Math.round(
                  ((p.price - p.discountPrice) / p.price) * 100
                );

                return (
                  <Card
                    key={p._id}
                    className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-slate-100"
                  >
                    {/* Image Container */}
                    <div className="relative overflow-hidden">
                      <Image
                        width={400}
                        height={400}
                        src={p.image}
                        alt={p.name}
                        className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {/* Discount Badge */}
                      <div className="absolute top-4 left-4">
                        <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-3 py-1.5 rounded-2xl text-sm font-semibold shadow-lg">
                          {discountPercentage}% OFF
                        </div>
                      </div>
                      {/* Category Badge */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-white/90 backdrop-blur-sm text-slate-700 px-3 py-1 rounded-full text-xs font-medium">
                          {p.category?.name}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <CardContent className="p-6 space-y-2">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                          {p.name}
                        </h3>
                      </div>

                      {/* Price Section */}
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
                        <Button className="bg-gradient-to-r from-orange-500 to-red-400 hover:from-indigo-600 hover:to-purple-600 text-white px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                          Add to Cart
                        </Button>
                      </div>
                    </CardContent>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
