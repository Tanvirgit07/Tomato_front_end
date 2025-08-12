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
    image: "https://images.unsplash.com/photo-1596495578066-dac883e1a52f?w=300&h=300&fit=crop",
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
    image: "https://images.unsplash.com/photo-1611637057911-02af7e2b6e8e?w=300&h=300&fit=crop",
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
    image: "https://images.unsplash.com/photo-1600585154526-990d71c4a932?w=300&h=300&fit=crop",
    originalPrice: 45.00,
    discountedPrice: 22.50,
    discountPercentage: 50,
    rating: 4.8,
  },
  {
    id: 5,
    name: "Aroma Bliss Perfume",
    category: "Fragrances",
    description: "A long-lasting floral fragrance.",
    image: "https://images.unsplash.com/photo-1600585154764-47e20ea6f7b6?w=300&h=300&fit=crop",
    originalPrice: 80.00,
    discountedPrice: 40.00,
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
      <div className="flex items-center text-yellow-400">
        {Array(fullStars)
          .fill(0)
          .map((_, i) => (
            <Star key={i} fill="currentColor" />
          ))}
        {halfStar && <Star key="half" fill="currentColor" className="text-yellow-400 opacity-50" />}
        {Array(emptyStars)
          .fill(0)
          .map((_, i) => (
            <Star key={`empty-${i}`} className="text-gray-300" />
          ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-gray-500 text-sm mb-2">Our Products</div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Best Sellers Products</h2>
      <Carousel className="w-full">
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden relative group">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-green-700 text-white px-2 py-1 rounded-full text-sm">
                    {product.discountPercentage}% off
                  </div>
                  <div className="absolute bottom-4 left-4 bg-green-700 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <span>{timeLeft.days}</span>:<span>{timeLeft.hours}</span>:<span>{timeLeft.minutes}</span>:<span>{timeLeft.seconds}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center mt-2">{renderStars(product.rating)}</div>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <span className="text-orange-600 font-bold text-lg">${product.discountedPrice.toFixed(2)}</span>
                      <span className="text-gray-400 line-through ml-2">${product.originalPrice.toFixed(2)}</span>
                    </div>
                    <span className="text-yellow-400">5.0</span>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="mt-6 text-right">
        <button className="bg-green-700 text-white px-6 py-2 rounded-full hover:bg-green-800">
          View All Products
        </button>
      </div>
    </div>
  );
};

export default BestSellingProduct;