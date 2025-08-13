"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter } from "lucide-react";
import { Star } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Silk Sculpt Serum",
    category: "Skin Care",
    company: "GlowVibe",
    description: "A luxurious serum for hydrated and glowing skin.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=300&fit=crop",
    originalPrice: 60.00,
    discountedPrice: 25.00,
    discountPercentage: 50,
    rating: 5.0,
  },
  {
    id: 2,
    name: "Glow Essence Oil",
    category: "Skin Care",
    company: "PureLuxe",
    description: "A nourishing oil with natural ingredients.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=300&fit=crop",
    originalPrice: 60.00,
    discountedPrice: 35.00,
    discountPercentage: 30,
    rating: 4.8,
  },
  {
    id: 3,
    name: "Radiance Drop Serum",
    category: "Skin Care",
    company: "GlowVibe",
    description: "An advanced serum for radiant skin.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=300&fit=crop",
    originalPrice: 73.00,
    discountedPrice: 40.00,
    discountPercentage: 40,
    rating: 5.0,
  },
  {
    id: 4,
    name: "Velvet Moisturizer",
    category: "Make Up",
    company: "BeautyBase",
    description: "A silky moisturizer for flawless makeup base.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=300&fit=crop",
    originalPrice: 45.00,
    discountedPrice: 22.50,
    discountPercentage: 50,
    rating: 4.8,
  },
  {
    id: 5,
    name: "Luminous Foundation",
    category: "Make Up",
    company: "PureLuxe",
    description: "A lightweight foundation for a radiant finish.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=300&fit=crop",
    originalPrice: 50.00,
    discountedPrice: 30.00,
    discountPercentage: 40,
    rating: 4.9,
  },
];

export default function AllProducts() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - Math.ceil(rating);

    return (
      <div className="flex items-center gap-0.5">
        {Array(fullStars)
          .fill(0)
          .map((_, i) => (
            <Star key={i} size={14} fill="#F59E0B" className="text-amber-500" />
          ))}
        {halfStar && <Star key="half" size={14} fill="#F59E0B" className="text-amber-500 opacity-50" />}
        {Array(emptyStars)
          .fill(0)
          .map((_, i) => (
            <Star key={`empty-${i}`} size={14} className="text-slate-300" />
          ))}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 rounded-full mb-4">
            <span className="text-indigo-600 font-medium text-sm">Shop Now</span>
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
            <Card className={`lg:block ${isFilterOpen ? "block" : "hidden"} bg-white rounded-3xl shadow-lg border border-slate-100 p-6`}>
              <h2 className="text-xl font-bold text-slate-800 mb-6">Filters</h2>
              
              {/* Search */}
              <div className="mb-6">
                <Label htmlFor="search" className="text-slate-800 font-semibold">Search</Label>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <Input
                    id="search"
                    placeholder="Search products..."
                    className="pl-10 rounded-2xl border-slate-200"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <Label className="text-slate-800 font-semibold">Category</Label>
                <div className="mt-2 space-y-2">
                  {["Skin Care", "Make Up"].map((category) => (
                    <div key={category} className="flex items-center">
                      <Checkbox id={`category-${category}`} />
                      <label htmlFor={`category-${category}`} className="ml-2 text-sm text-slate-600">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Company Filter */}
              <div>
                <Label htmlFor="company" className="text-slate-800 font-semibold">Company</Label>
                <Select>
                  <SelectTrigger id="company" className="mt-2 rounded-2xl border-slate-200">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {["GlowVibe", "PureLuxe", "BeautyBase"].map((company) => (
                      <SelectItem key={company} value={company}>
                        {company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </div>

          {/* Product Grid */}
          <div className="lg:w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-slate-100"
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Discount Badge */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-3 py-1.5 rounded-2xl text-sm font-semibold shadow-lg">
                        {product.discountPercentage}% OFF
                      </div>
                    </div>
                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm text-slate-700 px-3 py-1 rounded-full text-xs font-medium">
                        {product.category}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-slate-600 text-sm mt-2 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                      <p className="text-slate-500 text-xs mt-1">by {product.company}</p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-3">
                      {renderStars(product.rating)}
                      <span className="text-amber-600 font-semibold text-sm">
                        {product.rating}
                      </span>
                    </div>

                    {/* Price Section */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            ${product.discountedPrice.toFixed(2)}
                          </span>
                          <span className="text-slate-400 line-through text-sm">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-green-600 text-xs font-medium">
                          Save ${(product.originalPrice - product.discountedPrice).toFixed(2)}
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}