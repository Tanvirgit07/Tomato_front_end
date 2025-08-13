"use client";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";

const products = [
  {
    id: 1,
    name: "Silk Sculpt Serum",
    category: "Skin Care",
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
    description: "A nourishing oil with natural ingredients.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=300&fit=crop",
    originalPrice: 60.00,
    discountedPrice: 35.00,
    discountPercentage: 30,
    rating: 5.0,
  },
  {
    id: 3,
    name: "Radiance Drop Serum",
    category: "Skin Care",
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
    description: "A silky moisturizer for flawless makeup base.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=300&fit=crop",
    originalPrice: 45.00,
    discountedPrice: 22.50,
    discountPercentage: 50,
    rating: 4.8,
  },
];

const BestSellingProduct = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 12,
    minutes: 30,
    seconds: 24,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        seconds -= 1;
        if (seconds < 0) {
          seconds = 59;
          minutes -= 1;
        }
        if (minutes < 0) {
          minutes = 59;
          hours -= 1;
        }
        if (hours < 0) {
          hours = 23;
          days -= 1;
        }
        if (days < 0) {
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 rounded-full mb-4">
            <span className="text-indigo-600 font-medium text-sm">Our Products</span>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
            New Arrival Collection
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Discover our latest premium products crafted with the finest ingredients for your beauty needs
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div 
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

                {/* Timer Badge */}
                <div className="absolute bottom-4 right-4">
                  <div className="bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-2xl text-xs font-mono">
                    <div className="flex items-center gap-1">
                      <span className="font-bold">{String(timeLeft.days).padStart(2, '0')}</span>
                      <span className="opacity-60">:</span>
                      <span className="font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
                      <span className="opacity-60">:</span>
                      <span className="font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
                      <span className="opacity-60">:</span>
                      <span className="font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
                    </div>
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
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-slate-600 text-sm mt-2 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
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
                  
                  {/* Add to Cart Button */}
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

        {/* View All Button */}
        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-orange-500 to-red-400 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl">
            View All Products
            <span className="ml-2">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BestSellingProduct;