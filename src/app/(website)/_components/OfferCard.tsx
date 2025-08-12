"use client";

const offerProducts = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1590080877777-86bde2ccfc36?w=400&h=400&fit=crop",
    discountPercentage: 35,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=400&fit=crop",
    discountPercentage: 25,
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400&h=400&fit=crop",
    discountPercentage: 40,
  },
   {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400&h=400&fit=crop",
    discountPercentage: 40,
  },
];

export default function SimpleOfferGallery() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-center mb-8">Exclusive Offers</h2>

      {/* Grid of offer images */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {offerProducts.map((product) => (
          <div
            key={product.id}
            className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={product.image}
              alt={`Offer ${product.id}`}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
              {product.discountPercentage}% OFF
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
