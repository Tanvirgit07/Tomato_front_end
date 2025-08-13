'use client';

import { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import ProductHome from './ProductHome';

const categories = [
  {
    id: 1,
    name: 'Salad',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=150&h=150&fit=crop&crop=center',
    alt: 'Fresh salad bowl',
  },
  {
    id: 2,
    name: 'Rolls',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150&h=150&fit=crop&crop=center',
    alt: 'Delicious rolls',
  },
  {
    id: 3,
    name: 'Deserts',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=150&h=150&fit=crop&crop=center',
    alt: 'Sweet desserts',
  },
  {
    id: 4,
    name: 'Sandwich',
    image: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=150&h=150&fit=crop&center',
    alt: 'Fresh sandwich',
  },
  {
    id: 5,
    name: 'Cake',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150&h=150&fit=crop&crop=center',
    alt: 'Delicious cake',
  },
  {
    id: 6,
    name: 'Pure Veg',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=150&h=150&fit=crop&crop=center',
    alt: 'Pure vegetarian food',
  },
  {
    id: 7,
    name: 'Pasta',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150&h=150&fit=crop&crop=center',
    alt: 'Delicious pasta',
  },
  {
    id: 8,
    name: 'Noodles',
    image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=150&h=150&fit=crop&crop=center',
    alt: 'Asian noodles',
  },
  {
    id: 9,
    name: 'Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150&h=150&fit=crop&crop=center',
    alt: 'Delicious pizza',
  },
  {
    id: 10,
    name: 'Burger',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&h=150&fit=crop&crop=center',
    alt: 'Tasty burger',
  },
  {
    id: 11,
    name: 'Soup',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=150&h=150&fit=crop&crop=center',
    alt: 'Hot soup',
  },
  {
    id: 12,
    name: 'Drinks',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=150&h=150&fit=crop&crop=center',
    alt: 'Refreshing drinks',
  },
  {
    id: 13,
    name: 'Ice Cream',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=150&h=150&fit=crop&crop=center',
    alt: 'Delicious ice cream',
  },
  {
    id: 14,
    name: 'Seafood',
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=150&h=150&fit=crop&crop=center',
    alt: 'Fresh seafood',
  },
];

const Category = () => {
  const [activeCategory, setActiveCategory] = useState('Salad');

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Discover Our Menu
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore a diverse selection of dishes crafted with the finest ingredients to satisfy your cravings and elevate your dining experience.
          </p>
        </div>

        {/* Categories Carousel */}
        <div className="relative">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-3 sm:-ml-4">
              {categories.map((category) => (
                <CarouselItem
                  key={category.id}
                  className="pl-3 sm:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 2xl:basis-1/7"
                >
                  <div
                    onClick={() => handleCategoryClick(category.name)}
                    className={`flex flex-col items-center cursor-pointer group transition-all duration-300 p-3 rounded-xl ${
                      activeCategory === category.name
                        ? ' transform scale-105'
                        : ' hover:transform hover:scale-105'
                    }`}
                  >
                    {/* Image Container */}
                    <div
                      className={`relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 mb-4 rounded-full overflow-hidden transition-all duration-300 ${
                        activeCategory === category.name
                          ? 'ring-4 ring-orange-400 shadow-xl'
                          : 'group-hover:shadow-xl group-hover:ring-2 group-hover:ring-orange-200'
                      }`}
                    >
                      <img
                        src={category.image}
                        alt={category.alt}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>

                    {/* Category Name */}
                    <h3
                      className={`text-sm sm:text-base lg:text-lg font-semibold text-center transition-colors duration-300 ${
                        activeCategory === category.name
                          ? 'text-orange-600'
                          : 'text-gray-800 group-hover:text-orange-600'
                      }`}
                    >
                      {category.name}
                    </h3>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Buttons */}
            <CarouselPrevious
              className="absolute -left-2 lg:-left-6 sm:-left-8 top-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-red-600 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 border-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
            />
            <CarouselNext
              className="absolute -right-2 lg:-right-6 sm:-right-8 top-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-red-600 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 border-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
            />
          </Carousel>
        </div>

        {/* Selected Category Products */}
        <div className="mt-10 sm:mt-12 lg:mt-16">
          <ProductHome activeCategory={activeCategory} />
        </div>
      </div>
    </section>
  );
};

export default Category;