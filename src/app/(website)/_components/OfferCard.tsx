/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice: number;
}

interface Offer {
  _id: string;
  title: string;
  description: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  image: string;
  products: Product[];
}

export default function SimpleOfferGallery() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showAll, setShowAll] = useState<boolean>(false);

  const {
    data: offerData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["offerData"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/offer/getalloffer`
      );
      if (!res.ok) throw new Error("Failed to fetch offers");
      return res.json();
    },
  });

  if (isError)
    return (
      <p className="text-center text-red-500 mt-16">
        {error instanceof Error ? error.message : "Something went wrong"}
      </p>
    );

  // Flatten offers → ekshathe shob products pabo
  const allProducts =
    offerData?.data?.flatMap((offer: Offer) =>
      offer.products.map((product) => ({
        ...product,
        offer, // product sathe tar offer details rakhbo
      }))
    ) || [];

  // Jodi showAll false hoy, sudhu 6 ta dakhabe
  const displayedProducts = showAll ? allProducts : allProducts.slice(0, 8);

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 px-6 py-3 rounded-full mb-6">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            <span className="text-orange-700 font-semibold text-sm uppercase tracking-wide">
              Limited Time Only
            </span>
          </div>

          <h2 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent">
              Exclusive
            </span>
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent ml-3">
              Offers
            </span>
          </h2>

          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Don&apos;t miss out on these incredible deals. Premium products at
            prices that won&apos;t last long.
          </p>
        </div>

        {/* Grid of offer images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading
            ? // Skeleton Loading for 6 items
              Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-3xl overflow-hidden shadow-lg animate-pulse bg-white flex flex-col"
                >
                  <div className="w-full h-80 bg-gray-300 rounded-3xl" />
                  <div className="p-4 flex flex-col gap-2">
                    <div className="h-6 bg-gray-300 rounded-md w-3/4" />
                    <div className="h-4 bg-gray-200 rounded-md w-1/2" />
                    <div className="h-10 bg-gray-300 rounded-2xl mt-2" />
                  </div>
                </div>
              ))
            : displayedProducts.map((item: any, index: number) => (
                <div
                  key={item._id}
                  className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 cursor-pointer"
                  onMouseEnter={() => setHoveredItem(item._id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{
                    animationDelay: `${index * 150}ms`,
                  }}
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden">
                    <Image
                      width={300}
                      height={300}
                      src={item.offer.image || ""}
                      alt={item.name}
                      className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                    {/* Discount Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <div className="relative">
                        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-2xl font-bold text-lg shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                          {item.offer.discountPercentage}% OFF
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur-lg opacity-50 -z-10 animate-pulse"></div>
                      </div>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-orange-300 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-sm opacity-90 group-hover:opacity-100 transition-opacity">
                        {item.offer.description}
                      </p>

                      {/* Shop Now Button */}
                      <div
                        className={`mt-4 transform transition-all duration-300 ${
                          hoveredItem === item._id
                            ? "translate-y-0 opacity-100"
                            : "translate-y-4 opacity-0"
                        }`}
                      >
                        <Link href={`/products/${item._id}`}>
                          <button className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-semibold hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 shadow-lg">
                            Shop Now
                            <span className="ml-2">→</span>
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        <div className="text-center mt-12">
          <Link href={"/offer"}>
            <button className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              showAll
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
