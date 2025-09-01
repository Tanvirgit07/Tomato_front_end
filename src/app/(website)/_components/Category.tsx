"use client";

import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProductHome from "./ProductHome";
import { useQuery } from "@tanstack/react-query";
import { categoyMap } from "../../../../types";
import Image from "next/image";

const Category = () => {
  const [activeCategory, setActiveCategory] = useState("Salad");

  const {
    data: mainCategory,
    isLoading,
    isError,
  } = useQuery({
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

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
    console.log(categoryName)
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error</p>;
  if (mainCategory?.length === 0) {
    return <p>No category found</p>;
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Discover Our Menu
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore a diverse selection of dishes crafted with the finest
            ingredients to satisfy your cravings and elevate your dining
            experience.
          </p>
        </div>

        {/* Categories Carousel */}
        {/* Categories Carousel */}
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 sm:-ml-3">
              {" "}
              {/* gap reduced */}
              {categories.map((category: categoyMap) => (
                <CarouselItem
                  key={category._id}
                  className="pl-2 sm:pl-3 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 2xl:basis-1/7"
                >
                  <div
                    onClick={() => handleCategoryClick(category.categoryName)}
                    className={`flex flex-col items-center cursor-pointer group transition-transform duration-300 p-2 sm:p-3 rounded-xl ${
                      activeCategory === category.categoryName
                        ? "scale-105"
                        : "hover:scale-105"
                    }`}
                  >
                    {/* Image Container */}
                    <div
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 mb-3 rounded-full overflow-hidden transition-all duration-300 ${
                        activeCategory === category.categoryName
                          ? "ring-4 ring-orange-400 shadow-lg"
                          : "group-hover:shadow-md group-hover:ring-2 group-hover:ring-orange-200"
                      }`}
                    >
                      <Image
                        width={200}
                        height={200}
                        src={category.image}
                        alt={category.categoryName}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>

                    {/* Category Name */}
                    <h3
                      className={`text-xs sm:text-sm lg:text-base font-semibold text-center transition-colors duration-300 ${
                        activeCategory === category.categoryName
                          ? "text-orange-600"
                          : "text-gray-800 group-hover:text-orange-600"
                      }`}
                    >
                      {category.categoryName}
                    </h3>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Buttons */}
            <CarouselPrevious className="absolute -left-2 lg:-left-5 sm:-left-6 top-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-red-400 text-white w-9 h-9 sm:w-10 sm:h-10 rounded-full shadow-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 border-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2" />
            <CarouselNext className="absolute -right-2 lg:-right-5 sm:-right-6 top-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-red-400 text-white w-9 h-9 sm:w-10 sm:h-10 rounded-full shadow-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 border-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2" />
          </Carousel>
        </div>

        {/* Selected Category Products */}
        <div className="mt-10 sm:mt-12 lg:mt-16">
          <ProductHome activeCategory={activeCategory} />
        </div>
      </div>
    </section>
  );
};

export default Category;
