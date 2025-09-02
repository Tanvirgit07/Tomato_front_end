import React from 'react';
import { ChevronRight } from 'lucide-react';

const ProductDetailsHeader = () => {
  return (
    <div className="relative w-full h-64 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/clothing-rack.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Fallback gradient background if image doesn't load */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 via-red-500 via-orange-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-600 opacity-80"></div>
      </div>
      
      {/* Dark Overlay for Better Text Readability */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-white px-4">
        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-center tracking-tight">
          Product Details
        </h1>
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm md:text-base opacity-90">
          <button className="hover:text-gray-300 cursor-pointer transition-colors duration-200 hover:underline">
            Home
          </button>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <button className="hover:text-gray-300 cursor-pointer transition-colors duration-200 hover:underline">
            Products
          </button>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <span className="text-gray-300 font-medium">
            Product Details
          </span>
        </nav>
      </div>
    </div>
  );
};

export default ProductDetailsHeader;