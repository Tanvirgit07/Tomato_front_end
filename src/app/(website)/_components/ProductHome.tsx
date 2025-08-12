import { Star } from "lucide-react";

type ProductHomeProps = {
  activeCategory: string;
};

const dishes = [
  {
    id: 1,
    name: "Fresh Garden Salad",
    category: "Salad",
    description: "A healthy mix of fresh vegetables with a tangy vinaigrette dressing.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=300&fit=crop",
    price: 150,
    rating: 4.5,
  },
  {
    id: 2,
    name: "Chicken Caesar Roll",
    category: "Rolls",
    description: "Grilled chicken wrapped with fresh lettuce and Caesar sauce in a soft roll.",
    image: "https://images.unsplash.com/photo-1562929633738-8fe44f7ec21e?w=300&h=300&fit=crop",
    price: 220,
    rating: 4.7,
  },
  {
    id: 3,
    name: "Chocolate Fudge Cake",
    category: "Cake",
    description: "Rich and moist chocolate cake topped with creamy fudge frosting.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop",
    price: 350,
    rating: 4.9,
  },
  {
    id: 4,
    name: "Vegetable Pasta",
    category: "Pasta",
    description: "Penne pasta tossed with fresh vegetables and tomato basil sauce.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=300&fit=crop",
    price: 280,
    rating: 4.2,
  },
  {
    id: 5,
    name: "Spicy Chicken Kabab",
    category: "Kabab",
    description: "Juicy chicken kababs marinated with special spices and grilled to perfection.",
    image: "https://images.unsplash.com/photo-1617191514663-3ec3bbfe21e9?w=300&h=300&fit=crop",
    price: 300,
    rating: 4.6,
  },
  {
    id: 6,
    name: "Classic Chocolate Roll",
    category: "Rolls",
    description: "Soft chocolate-flavored roll cake with creamy filling.",
    image: "https://images.unsplash.com/photo-1562440499-5b83aef6d7b9?w=300&h=300&fit=crop",
    price: 270,
    rating: 4.8,
  },
  {
    id: 7,
    name: "Fruit Salad Bowl",
    category: "Salad",
    description: "A refreshing bowl of mixed seasonal fruits with honey drizzle.",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&h=300&fit=crop",
    price: 180,
    rating: 4.4,
  },
  {
    id: 8,
    name: "Vanilla Ice Cream Dessert",
    category: "Desserts",
    description: "Creamy vanilla ice cream served with chocolate syrup and nuts.",
    image: "https://images.unsplash.com/photo-1505253210343-f0ff334f1129?w=300&h=300&fit=crop",
    price: 200,
    rating: 4.7,
  },
];

export default function ProductHome({ activeCategory }: ProductHomeProps) {
  console.log(activeCategory);
  const filteredDishes = activeCategory
    ? dishes.filter((dish) => dish.category.toLowerCase() === activeCategory.toLowerCase())
    : dishes;

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - Math.ceil(rating);

    return (
      <div className="flex items-center text-yellow-500">
        {Array(fullStars)
          .fill(0)
          .map((_, i) => (
            <Star key={i} fill="currentColor" />
          ))}
        {halfStar && <Star key="half" fill="currentColor" className="text-yellow-500 opacity-50" />}
        {Array(emptyStars)
          .fill(0)
          .map((_, i) => (
            <Star key={`empty-${i}`} className="text-gray-300" />
          ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Top dishes near you</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredDishes.map((dish) => (
          <div
            key={dish.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={dish.image}
              alt={dish.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{dish.name}</h3>
              <div className="flex items-center mt-2">{renderStars(dish.rating)}</div>
              <p className="text-gray-600 text-sm mt-2 line-clamp-2">{dish.description}</p>
              <p className="text-orange-600 font-bold text-lg mt-3">${dish.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}