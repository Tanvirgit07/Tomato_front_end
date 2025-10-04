"use client";

import React from "react";
import { Bike } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const BecomeABoy = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-20 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Text Content */}
        <div className="md:w-1/2 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Become a Delivery Man 🚴‍♂️
          </h2>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed">
            Earn money on your own schedule by joining our delivery team!
            Deliver products, help customers, and enjoy flexible working hours
            with great rewards.
          </p>

          <Link href="/become-boy">
            <button className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-all duration-200">
              <Bike className="w-5 h-5" />
              Join as Delivery Agent
            </button>
          </Link>
        </div>

        {/* Illustration */}
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-[350px] h-[250px] md:w-[400px] md:h-[300px] rounded-xl overflow-hidden shadow-xl hover:scale-105 transition-transform duration-300">
            <Image
              src="/images/delivary.jpg"
              alt="Become a Delivery Agent"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomeABoy;
