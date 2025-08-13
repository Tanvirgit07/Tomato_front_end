"use client";
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Award, Shield, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface StarRatingProps {
  rating: number;
}

interface Brand {
  id: number;
  name: string;
  logo: string;
  category: string;
  description: string;
  founded: string;
  rating: number;
  products: number;
  verified: boolean;
  featured: boolean;
  color: string;
  lightColor: string;
  website: string;
}

interface BrandCardProps {
  brand: Brand;
  index: number;
}


// Brand data with professional information
const brandsData = [
  {
    id: 1,
    name: "TechNova",
    logo: "TN",
    category: "Technology",
    description: "Leading innovation in smart devices and IoT solutions",
    founded: "2015",
    rating: 4.9,
    products: 150,
    verified: true,
    featured: true,
    color: "bg-blue-600",
    lightColor: "bg-blue-50",
    website: "technova.com"
  },
  {
    id: 2,
    name: "EcoGreen",
    logo: "EG",
    category: "Sustainability",
    description: "Eco-friendly products for a sustainable future",
    founded: "2012",
    rating: 4.8,
    products: 89,
    verified: true,
    featured: false,
    color: "bg-green-600",
    lightColor: "bg-green-50",
    website: "ecogreen.com"
  },
  {
    id: 3,
    name: "LuxeCraft",
    logo: "LC",
    category: "Luxury",
    description: "Premium handcrafted goods and luxury accessories",
    founded: "2008",
    rating: 4.9,
    products: 67,
    verified: true,
    featured: true,
    color: "bg-purple-600",
    lightColor: "bg-purple-50",
    website: "luxecraft.com"
  },
  {
    id: 4,
    name: "SportMax",
    logo: "SM",
    category: "Sports",
    description: "Professional sports equipment and athletic wear",
    founded: "2010",
    rating: 4.7,
    products: 234,
    verified: true,
    featured: false,
    color: "bg-orange-600",
    lightColor: "bg-orange-50",
    website: "sportmax.com"
  },
  {
    id: 5,
    name: "HealthCore",
    logo: "HC",
    category: "Health",
    description: "Medical devices and health monitoring solutions",
    founded: "2014",
    rating: 4.8,
    products: 112,
    verified: true,
    featured: true,
    color: "bg-red-600",
    lightColor: "bg-red-50",
    website: "healthcore.com"
  },
  {
    id: 6,
    name: "HomeStyle",
    logo: "HS",
    category: "Home & Living",
    description: "Modern furniture and home decoration essentials",
    founded: "2011",
    rating: 4.6,
    products: 189,
    verified: true,
    featured: false,
    color: "bg-indigo-600",
    lightColor: "bg-indigo-50",
    website: "homestyle.com"
  },
  {
    id: 7,
    name: "AutoTech",
    logo: "AT",
    category: "Automotive",
    description: "Cutting-edge automotive parts and accessories",
    founded: "2009",
    rating: 4.7,
    products: 298,
    verified: true,
    featured: false,
    color: "bg-gray-700",
    lightColor: "bg-gray-50",
    website: "autotech.com"
  },
  {
    id: 8,
    name: "FashionHub",
    logo: "FH",
    category: "Fashion",
    description: "Trendy clothing and fashion accessories",
    founded: "2016",
    rating: 4.5,
    products: 445,
    verified: true,
    featured: true,
    color: "bg-pink-600",
    lightColor: "bg-pink-50",
    website: "fashionhub.com"
  }
];

const BrandSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(4);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'carousel'

  // Get unique categories
  const categories = ['all', ...new Set(brandsData.map(brand => brand.category))];

  // Filter brands based on selected category
  const filteredBrands = selectedCategory === 'all' 
    ? brandsData 
    : brandsData.filter(brand => brand.category === selectedCategory);

  // Responsive items per slide
  const getItemsPerSlide = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 768) return 2;
      if (window.innerWidth < 1024) return 3;
      return 4;
    }
    return 4;
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newItemsPerSlide = getItemsPerSlide();
      setItemsPerSlide(newItemsPerSlide);
      
      // Adjust current slide if needed
      const maxSlide = Math.max(0, Math.ceil(filteredBrands.length / newItemsPerSlide) - 1);
      if (currentSlide > maxSlide) {
        setCurrentSlide(0);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentSlide, filteredBrands.length]);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || viewMode === 'grid') return;

    const maxSlides = Math.ceil(filteredBrands.length / itemsPerSlide);
    if (maxSlides <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % maxSlides);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, itemsPerSlide, filteredBrands.length, viewMode]);

  const maxSlides = Math.ceil(filteredBrands.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % maxSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + maxSlides) % maxSlides);
  };

  const goToSlide = (slideIndex:number) => {
    setCurrentSlide(slideIndex);
  };

  const handleCategoryChange = (category:string) => {
    setSelectedCategory(category);
    setCurrentSlide(0);
  };

  const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const validRating = Math.max(0, Math.min(5, Math.floor(rating)));

  return (
    <div className="flex items-center gap-1" role="img" aria-label={`${validRating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${
            i < validRating
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-200 text-gray-200'
          }`}
          aria-hidden="true"
        />
      ))}
      <span className="text-xs text-gray-600 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
};


const BrandCard: React.FC<BrandCardProps> = ({ brand, index }) => (
  <Card
    className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-0 shadow-lg bg-gradient-to-br from-white to-gray-50"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <CardContent className="p-6 text-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-10 transform rotate-12 translate-x-6 -translate-y-6">
        <div className={`w-full h-full rounded-full ${brand.color}`}></div>
      </div>

      {/* Featured badge */}
      {brand.featured && (
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 flex items-center">
            <Award className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        </div>
      )}

      {/* Verified badge */}
      {brand.verified && (
        <div className="absolute top-3 right-3">
          <div className="bg-green-100 rounded-full p-1">
            <Shield className="w-4 h-4 text-green-600" />
          </div>
        </div>
      )}

      {/* Logo */}
      <div className="mb-4 relative">
        <div
          className={`mx-auto w-16 h-16 rounded-2xl ${brand.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
        >
          <span className="text-white font-bold text-xl">{brand.logo}</span>
        </div>
        <div
          className={`absolute inset-0 w-16 h-16 rounded-2xl ${brand.lightColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300 mx-auto animate-pulse`}
        ></div>
      </div>

      {/* Brand info */}
      <div className="space-y-3">
        <div>
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">{brand.name}</h3>
          <p className="text-sm text-gray-500 mb-2">{brand.category}</p>
          <p className="text-xs text-gray-600 leading-relaxed h-12 overflow-hidden">{brand.description}</p>
        </div>

        {/* Rating */}
        <StarRating rating={brand.rating} />

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="font-semibold text-sm text-gray-900">{brand.products}+</div>
            <div className="text-xs text-gray-500">Products</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-sm text-gray-900">Since {brand.founded}</div>
            <div className="text-xs text-gray-500">Established</div>
          </div>
        </div>

        {/* Website */}
        <div className="pt-2">
          <a
            href={`https://${brand.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
          >
            www.{brand.website}
          </a>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
    </CardContent>
  </Card>
);

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-blue-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Trusted Partners
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Leading <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Brands</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover products from world-class brands that trust us to deliver excellence. 
            Each partner is carefully selected for quality and innovation.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(category)}
                className="capitalize transition-all duration-200"
              >
                {category === 'all' ? 'All Brands' : category}
              </Button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              Grid View
            </Button>
            <Button
              variant={viewMode === 'carousel' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('carousel')}
            >
              Carousel
            </Button>
          </div>
        </div>

        {/* Brands Display */}
        {viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBrands.map((brand, index) => (
              <div
                key={brand.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <BrandCard brand={brand} index={index} />
              </div>
            ))}
          </div>
        ) : (
          /* Carousel View */
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: maxSlides }, (_, slideIndex) => (
                  <div key={slideIndex} className="flex-shrink-0 w-full">
                    <div className={`grid gap-6 ${
                      itemsPerSlide === 1 ? 'grid-cols-1' :
                      itemsPerSlide === 2 ? 'grid-cols-1 sm:grid-cols-2' :
                      itemsPerSlide === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
                      'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    }`}>
                      {filteredBrands
                        .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                        .map((brand, index) => (
                          <BrandCard key={brand.id} brand={brand} index={index} />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            {maxSlides > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-xl border-2"
                  onClick={prevSlide}
                  onMouseEnter={() => setIsAutoPlaying(false)}
                  onMouseLeave={() => setIsAutoPlaying(true)}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-xl border-2"
                  onClick={nextSlide}
                  onMouseEnter={() => setIsAutoPlaying(false)}
                  onMouseLeave={() => setIsAutoPlaying(true)}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </>
            )}

            {/* Carousel Indicators */}
            {maxSlides > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: maxSlides }, (_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-blue-600 scale-125' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    onClick={() => goToSlide(index)}
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-2">{brandsData.length}+</div>
              <div className="text-blue-100">Partner Brands</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-2">
                {brandsData.reduce((sum, brand) => sum + brand.products, 0).toLocaleString()}+
              </div>
              <div className="text-blue-100">Products</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-2">
                {(brandsData.reduce((sum, brand) => sum + brand.rating, 0) / brandsData.length).toFixed(1)}
              </div>
              <div className="text-blue-100">Avg Rating</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-2">15+</div>
              <div className="text-blue-100">Years Experience</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Explore All Brands
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default BrandSection;