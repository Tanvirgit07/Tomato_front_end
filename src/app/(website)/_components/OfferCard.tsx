"use client";
import { useState } from "react";
interface Product {
  id: number;
  image: string;
  discountPercentage: number;
  title: string;
  description: string;
}

const offerProducts = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop",
    discountPercentage: 35,
    title: "Premium Collection",
    description: "Luxury items at unbeatable prices",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=400&fit=crop",
    discountPercentage: 25,
    title: "Tech Essentials",
    description: "Latest gadgets & accessories",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400&h=400&fit=crop",
    discountPercentage: 40,
    title: "Fashion Forward",
    description: "Trendy styles for every season",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop",
    discountPercentage: 50,
    title: "Home & Living",
    description: "Transform your space",
  },
];

export default function SimpleOfferGallery() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
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
            Don't miss out on these incredible deals. Premium products at prices that won't last long.
          </p>
        </div>

        {/* Grid of offer images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {offerProducts.map((product:Product, index:number) => (
            <div
              key={product.id}
              className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 cursor-pointer"
              onMouseEnter={() => setHoveredItem(product.id)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                animationDelay: `${index * 150}ms`
              }}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                
                {/* Discount Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="relative">
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-2xl font-bold text-lg shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                      {product.discountPercentage}% OFF
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur-lg opacity-50 -z-10 animate-pulse"></div>
                  </div>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-orange-300 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-sm opacity-90 group-hover:opacity-100 transition-opacity">
                    {product.description}
                  </p>
                  
                  {/* Shop Now Button */}
                  <div className={`mt-4 transform transition-all duration-300 ${
                    hoveredItem === product.id 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-4 opacity-0'
                  }`}>
                    <button className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-semibold hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 shadow-lg">
                      Shop Now
                      <span className="ml-2">→</span>
                    </button>
                  </div>
                </div>

                {/* Sparkle Effect */}
                <div className="absolute top-6 left-6 w-3 h-3 bg-white rounded-full opacity-60 animate-ping"></div>
                <div className="absolute top-12 left-8 w-2 h-2 bg-orange-300 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-8 left-12 w-1 h-1 bg-yellow-300 rounded-full opacity-60 animate-ping" style={{ animationDelay: '0.5s' }}></div>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-orange-300/50 transition-colors duration-300 pointer-events-none"></div>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
            <div className="text-left">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Don't Miss Out!
              </h3>
              <p className="text-slate-600">
                These exclusive offers end soon. Shop now and save big!
              </p>
            </div>
            <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl whitespace-nowrap">
              View All Deals
            </button>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="fixed top-20 right-10 w-20 h-20 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-full blur-xl animate-float hidden lg:block"></div>
        <div className="fixed bottom-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-2xl animate-bounce hidden lg:block" style={{ animationDuration: '3s' }}></div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}