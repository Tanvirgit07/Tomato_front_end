"use client";

import { Star } from "lucide-react";
import { useEffect, useState } from "react";

type ProductHomeProps = {
  activeCategory: string;
};

const dishes = [
  {
    id: 1,
    name: "Fresh Garden Salad",
    category: "Salad",
    description:
      "A healthy mix of fresh vegetables with a tangy vinaigrette dressing.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=300&fit=crop",
    price: 150,
    rating: 4.5,
  },
  {
    id: 2,
    name: "Chicken Caesar Roll",
    category: "Rolls",
    description:
      "Grilled chicken wrapped with fresh lettuce and Caesar sauce in a soft roll.",
    image:
      "https://images.unsplash.com/photo-1562929633738-8fe44f7ec21e?w=300&h=300&fit=crop",
    price: 220,
    rating: 4.7,
  },
  {
    id: 3,
    name: "Chocolate Fudge Cake",
    category: "Cake",
    description:
      "Rich and moist chocolate cake topped with creamy fudge frosting.",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop",
    price: 350,
    rating: 4.9,
  },
  {
    id: 4,
    name: "Vegetable Pasta",
    category: "Pasta",
    description:
      "Penne pasta tossed with fresh vegetables and tomato basil sauce.",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=300&fit=crop",
    price: 280,
    rating: 4.2,
  },
  {
    id: 5,
    name: "Spicy Chicken Kabab",
    category: "Kabab",
    description:
      "Juicy chicken kababs marinated with special spices and grilled to perfection.",
    image:
      "https://images.unsplash.com/photo-1617191514663-3ec3bbfe21e9?w=300&h=300&fit=crop",
    price: 300,
    rating: 4.6,
  },
  {
    id: 6,
    name: "Classic Chocolate Roll",
    category: "Rolls",
    description: "Soft chocolate-flavored roll cake with creamy filling.",
    image:
      "https://images.unsplash.com/photo-1562440499-5b83aef6d7b9?w=300&h=300&fit=crop",
    price: 270,
    rating: 4.8,
  },
  {
    id: 7,
    name: "Fruit Salad Bowl",
    category: "Salad",
    description:
      "A refreshing bowl of mixed seasonal fruits with honey drizzle.",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&h=300&fit=crop",
    price: 180,
    rating: 4.4,
  },
  {
    id: 8,
    name: "Vanilla Ice Cream Dessert",
    category: "Desserts",
    description:
      "Creamy vanilla ice cream served with chocolate syrup and nuts.",
    image:
      "https://images.unsplash.com/photo-1505253210343-f0ff334f1129?w=300&h=300&fit=crop",
    price: 200,
    rating: 4.7,
  },
];

export default function ProductHome({ activeCategory }: ProductHomeProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const filteredDishes = activeCategory
    ? dishes.filter(
        (dish) => dish.category.toLowerCase() === activeCategory.toLowerCase()
      )
    : dishes;

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - Math.ceil(rating);

    return (
      <div className="flex items-center text-yellow-400">
        {Array(fullStars)
          .fill(0)
          .map((_, i) => (
            <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
          ))}
        {halfStar && (
          <Star
            key="half"
            className="w-4 h-4 sm:w-5 sm:h-5 fill-current opacity-50"
          />
        )}
        {Array(emptyStars)
          .fill(0)
          .map((_, i) => (
            <Star
              key={`empty-${i}`}
              className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300"
            />
          ))}
      </div>
    );
  };

  return (
    <div className="py-8 sm:py-12 lg:py-3">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-8 sm:mb-12 lg:mb-16 text-center tracking-tight">
        Top Dishes Near You
      </h2>

      {filteredDishes.length === 0 ? (
        <div className="flex justify-center items-center h-64 sm:h-72 lg:h-80 bg-gray-100 rounded-2xl shadow-lg">
          <p className="text-gray-500 text-lg sm:text-xl font-semibold">
            No Products Found 😔
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredDishes.map((dish, index) => (
            <div
              key={dish.id}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 group hover:shadow-xl hover:-translate-y-1 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative w-full h-48 sm:h-56 lg:h-64 overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 line-clamp-2 leading-tight">
                  {dish.name}
                </h3>
                <div className="flex items-center mt-2">
                  {renderStars(dish.rating)}
                </div>
                <p className="text-gray-600 text-sm sm:text-base mt-2 line-clamp-2 leading-relaxed">
                  {dish.description}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-orange-600 font-bold text-lg sm:text-xl">
                    ${dish.price}
                  </p>
                  <button className="bg-gradient-to-r from-orange-500 to-red-400 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
