"use client";

import { Star } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

const products = [
  {
    id: 1,
    name: "Silk Sculpt Serum",
    category: "Skin Care",
    description: "A luxurious serum for hydrated and glowing skin.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=300&fit=crop",
    originalPrice: 60.0,
    discountedPrice: 25.0,
    discountPercentage: 50,
    rating: 5.0,
  },
  {
    id: 2,
    name: "Glow Essence Oil",
    category: "Skin Care",
    description: "A nourishing oil with natural ingredients.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=300&fit=crop",
    originalPrice: 60.0,
    discountedPrice: 35.0,
    discountPercentage: 30,
    rating: 5.0,
  },
  {
    id: 3,
    name: "Radiance Drop Serum",
    category: "Skin Care",
    description: "An advanced serum for radiant skin.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=300&fit=crop",
    originalPrice: 73.0,
    discountedPrice: 40.0,
    discountPercentage: 40,
    rating: 5.0,
  },
  {
    id: 4,
    name: "Velvet Moisturizer",
    category: "Make Up",
    description: "A silky moisturizer for flawless makeup base.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=300&fit=crop",
    originalPrice: 45.0,
    discountedPrice: 22.5,
    discountPercentage: 50,
    rating: 4.8,
  },
  {
    id: 5,
    name: "Aroma Bliss Perfume",
    category: "Fragrances",
    description: "A long-lasting floral fragrance.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=300&fit=crop",
    originalPrice: 80.0,
    discountedPrice: 40.0,
    discountPercentage: 50,
    rating: 4.9,
  },
];

const BestSellingProduct = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 12,
    minutes: 30,
    seconds: 24,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
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
      <div className="flex items-center text-yellow-400">
        {Array(fullStars)
          .fill(0)
          .map((_, i) => (
            <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
          ))}
        {halfStar && (
          <Star
            key="half"
            className="w-4 h-4 sm:w-5 sm:h-5 fill-current opacity-50"
          />
        )}
        {Array(emptyStars)
          .fill(0)
          .map((_, i) => (
            <Star
              key={`empty-${i}`}
              className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300"
            />
          ))}
      </div>
    );
  };

  return (
    <section className="">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 rounded-full mb-4">
            <span className="text-indigo-600 font-medium text-sm">Our Products</span>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
            Best Selling Products
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Discover our latest premium products crafted with the finest ingredients for your beauty needs
          </p>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-3 sm:-ml-4">
            {products.map((product, index) => (
              <CarouselItem
                key={product.id}
                className="pl-3 sm:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 bg-white"
              >
                <div
                  className={`rounded-2xl overflow-hidden transform transition-all hover:border duration-500 group  hover:-translate-y-1 h-[400px] sm:h-[440px] lg:h-[480px] flex flex-col justify-between ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Image */}
                  <div className="relative w-full h-48 sm:h-56 lg:h-64 flex-shrink-0 overflow-hidden">
                    <Image
                    width={400}
                    height={400}
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                      {product.discountPercentage}% OFF
                    </div>
                    <div className="absolute bottom-3 left-3 bg-gray-900 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1">
                      <span>{String(timeLeft.days).padStart(2, "0")}d</span>:
                      <span>{String(timeLeft.hours).padStart(2, "0")}h</span>:
                      <span>{String(timeLeft.minutes).padStart(2, "0")}m</span>:
                      <span>{String(timeLeft.seconds).padStart(2, "0")}s</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 line-clamp-2 leading-tight">
                        {product.name}
                      </h3>
                      <div className="flex items-center mt-2 gap-2">
                        {renderStars(product.rating)}
                        <span className="text-yellow-400 text-xs sm:text-sm font-medium">
                          {product.rating.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm sm:text-base mt-2 line-clamp-3 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <span className="text-orange-600 font-bold text-base sm:text-lg lg:text-xl">
                          ${product.discountedPrice.toFixed(2)}
                        </span>
                        <span className="text-gray-400 line-through text-xs sm:text-sm">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      </div>
                      <button className="bg-gradient-to-r from-orange-500 to-red-400 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium hover:from-orange-600 hover:to-red-400 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute -left-6 sm:-left-8 top-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-red-400 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 border-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2" />
          <CarouselNext className="absolute -right-6 sm:-right-8 top-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-red-400 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 border-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2" />
        </Carousel>
        <div className="mt-8 sm:mt-10  lg:pt-16 pb-10 text-center">
          <button className="bg-gradient-to-r from-orange-500 to-red-400 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default BestSellingProduct;
