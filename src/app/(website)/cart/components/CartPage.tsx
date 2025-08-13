import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, ShoppingCart } from "lucide-react";

export default function CartPage() {
  const cartItems = [
    {
      id: 1,
      name: "Silk Sculpt Serum",
      image: "https://images.unsplash.com/photo-1616394584738-fc6e6126b1c8?w=100&h=100&fit=crop",
      price: 25.00,
      quantity: 2,
    },
    {
      id: 2,
      name: "Glow Essence Oil",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=100&h=100&fit=crop",
      price: 35.00,
      quantity: 1,
    },
    {
      id: 3,
      name: "Velvet Moisturizer",
      image: "https://images.unsplash.com/photo-1512496015850-a8ee5066e54c?w=100&h=100&fit=crop",
      price: 22.50,
      quantity: 3,
    },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-200 to-purple-200 px-4 py-2 rounded-full mb-4 shadow-sm">
            <ShoppingCart className="w-5 h-5 text-indigo-700" />
            <span className="text-indigo-700 font-semibold text-sm">Your Cart</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-800 to-purple-600 bg-clip-text text-transparent mb-4">
            Your Shopping Cart
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Review your selected items and proceed to checkout with ease.
          </p>
        </div>

        {/* Cart Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3">
            <Card className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-indigo-100">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-indigo-800">Cart Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {cartItems.length === 0 ? (
                  <p className="text-gray-600 text-center">Your cart is empty.</p>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-xl"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-indigo-900">{item.name}</h3>
                        <p className="text-gray-600 text-sm">
                          ${item.price.toFixed(2)} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Cart Summary */}
          <div className="w-full lg:w-1/3">
            <Card className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-indigo-100">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-indigo-800">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-indigo-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-2xl py-3 font-semibold text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}