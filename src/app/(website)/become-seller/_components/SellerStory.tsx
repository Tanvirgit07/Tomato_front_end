"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import Image from "next/image";

const SellerStory = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Alvina Akhter",
      business: "Alvina's Fashion World",
      quote:
        "Alvina Akhter, owner of Alvina's Fashion World, aimed to bring the latest trends to a wider audience. Since joining Daraz, her sales have soared, and she's grateful for the platform that helped grow her business.",
      videoThumbnail:
        "https://images.unsplash.com/photo-1594736797933-d0601ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      videoCaption: "My journey of Alvina's Fashion World started in 2015.",
    },
    {
      id: 2,
      name: "Mohammed Rahman",
      business: "Tech Solutions BD",
      quote:
        "Mohammed Rahman transformed his small electronics shop into a thriving online business. Through Daraz's platform, he reached customers nationwide and increased his revenue by 300% in just one year.",
      videoThumbnail:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      videoCaption: "From local shop to nationwide success story.",
    },
    {
      id: 3,
      name: "Fatima Khan",
      business: "Artisan Crafts",
      quote:
        "Fatima Khan's handmade crafts business flourished after joining Daraz. The platform's marketing tools and customer reach helped her traditional art find modern buyers across the country.",
      videoThumbnail:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      videoCaption: "Bringing traditional crafts to modern customers.",
    },
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const currentData = testimonials[currentTestimonial];

  return (
    <div className="bg-gradient-to-br from-orange-50 via-pink-50 to-red-50 py-20 px-6 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-pink-200 rounded-full blur-3xl opacity-30 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-30 -z-10"></div>

      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
            Seller Success Stories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear directly from sellers who transformed their businesses with us.
            Real people, real growth, real success.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Video */}
          <div className="relative">
            {/* Navigation Arrows */}
            <Button
              variant="ghost"
              size="icon"
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full w-12 h-12"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full w-12 h-12"
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </Button>

            {/* Video Container */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/40">
              <Image
                width={700}
                height={500}
                src={currentData.videoThumbnail}
                alt={`${currentData.name} testimonial`}
                className="w-full h-[420px] object-cover"
              />

              {/* Video Overlay */}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/90 hover:bg-white rounded-full w-20 h-20 shadow-xl"
                >
                  <Play className="h-10 w-10 text-gray-800 ml-1" />
                </Button>
              </div>

              {/* Video Caption */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <p className="text-white text-lg font-medium">
                  {currentData.videoCaption}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Testimonial Content */}
          <div className="space-y-8">
            <p className="text-gray-700 text-xl leading-relaxed italic">
              “{currentData.quote}”
            </p>

            <div>
              <p className="text-gray-900 font-bold text-lg">
                {currentData.name}
              </p>
              <p className="text-orange-600 font-medium">
                {currentData.business}
              </p>
            </div>

            {/* Pagination Dots */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentTestimonial
                      ? "bg-orange-500 scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerStory;
