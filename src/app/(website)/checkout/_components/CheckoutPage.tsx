import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Truck, ShoppingBag } from "lucide-react";
import Image from "next/image";

export default function CheckoutPage() {
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
            <ShoppingBag className="w-5 h-5 text-indigo-700" />
            <span className="text-indigo-700 font-semibold text-sm">Checkout</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-800 to-purple-600 bg-clip-text text-transparent mb-4">
            Complete Your Order
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Fill in your details and review your order to finalize your purchase.
          </p>
        </div>

        {/* Checkout Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="w-full lg:w-2/3">
            <Card className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-indigo-100 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-indigo-800">Checkout Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Billing Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-indigo-900">Billing Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-indigo-800">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter your name"
                        className="rounded-2xl border-indigo-200 focus:ring-indigo-500 bg-white/90 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-indigo-800">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="rounded-2xl border-indigo-200 focus:ring-indigo-500 bg-white/90 transition-all duration-300"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-indigo-800">Billing Address</Label>
                    <Input
                      id="address"
                      placeholder="Enter your address"
                      className="rounded-2xl border-indigo-200 focus:ring-indigo-500 bg-white/90 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Shipping Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-indigo-900 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-indigo-500" />
                    Shipping Details
                  </h3>
                  <div>
                    <Label htmlFor="shipping-address" className="text-indigo-800">Shipping Address</Label>
                    <Input
                      id="shipping-address"
                      placeholder="Enter shipping address"
                      className="rounded-2xl border-indigo-200 focus:ring-indigo-500 bg-white/90 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-indigo-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-indigo-500" />
                    Payment Method
                  </h3>
                  <RadioGroup defaultValue="credit-card" className="space-y-2">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="credit-card" id="credit-card" className="text-indigo-600 border-indigo-300" />
                      <Label htmlFor="credit-card" className="text-gray-700">Credit Card</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="paypal" id="paypal" className="text-indigo-600 border-indigo-300" />
                      <Label htmlFor="paypal" className="text-gray-700">PayPal</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="bank-transfer" id="bank-transfer" className="text-indigo-600 border-indigo-300" />
                      <Label htmlFor="bank-transfer" className="text-gray-700">Bank Transfer</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <Card className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-indigo-100 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-indigo-800">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <Image
                    width={300}
                    height={300}
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-indigo-900">{item.name}</h3>
                      <p className="text-gray-600 text-sm">
                        ${item.price.toFixed(2)} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="space-y-4">
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
                    Place Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}