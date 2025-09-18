"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";

const BecomeSellerSection = () => {
  const router = useRouter();
  

  const handleClick = () => {
    router.push("/become-seller");
  };

  return (
    <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Text Content */}
        <div className="md:w-1/2 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Become a Seller Today!
          </h2>
          <p className="text-lg md:text-xl text-white/90">
            Join our platform and start selling your products to thousands of customers. 
            It's fast, easy, and profitable!
          </p>
          <button
            onClick={handleClick}
            className="inline-flex items-center gap-2 bg-white text-purple-700 font-semibold px-6 py-3 rounded-lg hover:bg-purple-50 transition"
          >
            <ShoppingBag className="w-5 h-5" />
            Start Selling
          </button>
        </div>

        {/* Optional Illustration */}
        <div className="md:w-1/2">
          <img
            src="/images/seller.png" 
            alt="Become a Seller"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default BecomeSellerSection;
