import React from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

const ProductDetailsHeader = () => {
  return (
    <div className="relative w-full h-56 sm:h-64 md:h-72 lg:h-80 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
        {/* Animated shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
      </div>
      
      {/* Decorative circles */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
      
      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-white px-4 sm:px-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-4 sm:mb-6 shadow-lg">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span className="text-xs sm:text-sm font-medium tracking-wide">
            Premium Products
          </span>
        </div>
        
        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-center tracking-tight drop-shadow-lg">
          Product Details
        </h1>
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm md:text-base bg-white/10 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-2.5 rounded-full border border-white/20 shadow-lg">
          <Link 
            href="/"
            className="hover:text-yellow-300 cursor-pointer transition-colors duration-200 font-medium"
          >
            Home
          </Link>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-white/60" />
          <Link 
            href="/products"
            className="hover:text-yellow-300 cursor-pointer transition-colors duration-200 font-medium"
          >
            Products
          </Link>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-white/60" />
          <span className="text-yellow-300 font-semibold">
            Details
          </span>
        </nav>
      </div>

      {/* Bottom decorative wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-8 sm:h-12" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            opacity=".25" 
            className="fill-white"
          ></path>
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            opacity=".5" 
            className="fill-white"
          ></path>
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
            className="fill-white"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default ProductDetailsHeader;