"use client"
import React, { useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import ProductHome from './ProductHome'

const FoodCategory = () => {
  const [activeCategory, setActiveCategory] = useState('Salad')

  const categories = [
    {
      id: 1,
      name: 'Salad',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=150&h=150&fit=crop&crop=center',
      alt: 'Fresh salad bowl'
    },
    {
      id: 2,
      name: 'Rolls',
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=150&h=150&fit=crop&crop=center',
      alt: 'Delicious rolls'
    },
    {
      id: 3,
      name: 'Deserts',
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=150&h=150&fit=crop&crop=center',
      alt: 'Sweet desserts'
    },
    {
      id: 4,
      name: 'Sandwich',
      image: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=150&h=150&fit=crop&center',
      alt: 'Fresh sandwich'
    },
    {
      id: 5,
      name: 'Cake',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150&h=150&fit=crop&crop=center',
      alt: 'Delicious cake'
    },
    {
      id: 6,
      name: 'Pure Veg',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=150&h=150&fit=crop&crop=center',
      alt: 'Pure vegetarian food'
    },
    {
      id: 7,
      name: 'Pasta',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=150&h=150&fit=crop&crop=center',
      alt: 'Delicious pasta'
    },
    {
      id: 8,
      name: 'Noodles',
      image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=150&h=150&fit=crop&crop=center',
      alt: 'Asian noodles'
    },
    {
      id: 9,
      name: 'Pizza',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150&h=150&fit=crop&crop=center',
      alt: 'Delicious pizza'
    },
    {
      id: 10,
      name: 'Burger',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&h=150&fit=crop&crop=center',
      alt: 'Tasty burger'
    },
    {
      id: 11,
      name: 'Soup',
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=150&h=150&fit=crop&crop=center',
      alt: 'Hot soup'
    },
    {
      id: 12,
      name: 'Drinks',
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=150&h=150&fit=crop&crop=center',
      alt: 'Refreshing drinks'
    },
    {
      id: 13,
      name: 'Ice Cream',
      image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=150&h=150&fit=crop&crop=center',
      alt: 'Delicious ice cream'
    },
    {
      id: 14,
      name: 'Seafood',
      image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=150&h=150&fit=crop&crop=center',
      alt: 'Fresh seafood'
    }
  ]

  const handleCategoryClick = (categoryName:string) => {
    setActiveCategory(categoryName)
  }

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Explore our menu
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Choose from a diverse menu featuring a delectable array of dishes. Our mission is to satisfy your 
            cravings and elevate your dining experience, one delicious meal at a time.
          </p>
        </div>

        {/* Categories Carousel */}
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {categories.map((category) => (
                <CarouselItem 
                  key={category.id} 
                  className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 2xl:basis-1/8"
                >
                  <div
                    onClick={() => handleCategoryClick(category.name)}
                    className={`flex flex-col items-center cursor-pointer group transition-all duration-200 p-2 ${
                      activeCategory === category.name 
                        ? 'transform scale-105' 
                        : 'hover:transform hover:scale-105'
                    }`}
                  >
                    {/* Image Container */}
                    <div className={`relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 mb-3 sm:mb-4 rounded-full overflow-hidden transition-all duration-200 ${
                      activeCategory === category.name 
                        ? 'ring-4 ring-orange-400 shadow-lg' 
                        : 'group-hover:shadow-md'
                    }`}>
                      <img
                        src={category.image}
                        alt={category.alt}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                      />
                    </div>
                    
                    {/* Category Name */}
                    <h3 className={`text-xs sm:text-sm lg:text-base font-medium text-center transition-colors duration-200 whitespace-nowrap ${
                      activeCategory === category.name 
                        ? 'text-orange-500 font-semibold' 
                        : 'text-gray-700 group-hover:text-orange-500'
                    }`}>
                      {category.name}
                    </h3>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Navigation Buttons */}
            <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white shadow-lg border-2 hover:bg-orange-50 hover:border-orange-200 transition-colors" />
            <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white shadow-lg border-2 hover:bg-orange-50 hover:border-orange-200 transition-colors" />
          </Carousel>
        </div>

        {/* Optional: Show selected category */}
        <div className="text-center mt-8 sm:mt-12">
          <ProductHome activeCategory={activeCategory}/>
        </div>
      </div>
    </section>
  )
}

export default FoodCategory