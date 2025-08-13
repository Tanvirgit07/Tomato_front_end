'use client';

import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const CTASection = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <Card className="border-none shadow-lg overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 md:p-12 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <ShoppingBag className="w-4 h-4" />
              Start Shopping Now
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Discover Your <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Perfect Products</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Explore our curated collection of top-quality products designed to elevate your shopping experience. Join thousands of satisfied customers today!
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-orange-400 to-red-400 hover:bg-blue-700 text-white px-8 py-3 text-base md:text-lg font-semibold"
            >
              <Link href="/products">
                Shop Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CTASection;