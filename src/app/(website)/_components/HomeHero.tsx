"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const slides = [
  {
    image: '/images/header_img.png',
    title: 'Delicious Pizza',
    description: 'Freshly baked with premium ingredients. Perfect for any occasion.',
  },
  {
    image: '/images/header_img.png',
    title: 'Juicy Burgers',
    description: 'Made with 100% beef, fresh veggies, and special sauce.',
  },
  {
    image: '/images/header_img.png',
    title: 'Healthy Salads',
    description: 'Fresh, nutritious, and bursting with flavor.',
  },
];

const HomeHero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[92vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover object-center"
            priority={index === 0}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60"></div>
        </div>
      ))}

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center h-full">
            <div className="text-white space-y-6 sm:space-y-8 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight drop-shadow-lg">
                {slides[currentIndex].title}
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-lg mx-auto lg:mx-0 drop-shadow-md">
                {slides[currentIndex].description}
              </p>
              
              <div>
                <Link 
                  href="/menu" 
                  className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95"
                >
                  View Menu
                </Link>
              </div>
            </div>

            <div className="hidden lg:block"></div>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HomeHero;