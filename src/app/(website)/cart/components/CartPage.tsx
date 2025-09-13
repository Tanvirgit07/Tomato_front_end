"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, ShoppingCart, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast } from "sonner";


interface ProductItem {
  _id: string;
  userId: string;
  productId: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface CartData {
  userId: string;
  products: ProductItem[];
}


export default function CartPage() {
  const session = useSession();
  const user = session?.data?.user as any;
  const userId = user?.id;

  const queryClient = useQueryClient();

  // Fetch cart data
  const { data: cartData, isLoading } = useQuery({
    queryKey: ["cart", userId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/cart/cartuser/${userId}`
      );
      if (!res.ok) throw new Error("Failed to fetch cart");
      return res.json();
    },
  });

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: async ({
      productId,
      action,
    }: {
      productId: string;
      action: "increment" | "decrement";
    }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/cart/update/${userId}/${productId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        }
      );
      if (!res.ok) throw new Error("Failed to update cart");
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  // Delete item mutation
  const deleteItemMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/cart/deletecartitem/${userId}/${productId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete cart item");
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const items = cartData?.data || [];
  // console.log("items", items)

  const subtotal = items.reduce(
    (sum: number, item: any) =>
      sum + item.productId.discountPrice * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const paymentMutation = useMutation({
    mutationFn: async (bodyData: CartData) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/payment/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      // success হলে stripe এর checkout url এ redirect করতে হবে
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      console.error("Payment session creation failed:", error);
    },
  });

  const handlePayment = () => {
    const body = {
      products: items,
      userId: userId,
    };
    console.log("body", body);
    paymentMutation.mutate(body)
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-200 to-purple-200 px-4 py-2 rounded-full mb-4 shadow-sm">
            <ShoppingCart className="w-5 h-5 text-indigo-700" />
            <span className="text-indigo-700 font-semibold text-sm">
              Your Cart
            </span>
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
                <CardTitle className="text-2xl font-bold text-indigo-800">
                  Cart Items
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoading ? (
                  <p className="text-center text-gray-500">Loading cart...</p>
                ) : items.length === 0 ? (
                  <p className="text-gray-600 text-center">
                    Your cart is empty.
                  </p>
                ) : (
                  items.map((item: any) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <Image
                        width={80}
                        height={80}
                        src={item.productId.image}
                        alt={item.productId.name}
                        className="w-20 h-20 object-cover rounded-xl"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-indigo-900">
                          {item.productId.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          ${item.productId.discountPrice} x {item.quantity} ={" "}
                          <span className="font-semibold text-indigo-700">
                            $
                            {(
                              item.productId.discountPrice * item.quantity
                            ).toFixed(2)}
                          </span>
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantityMutation.mutate({
                              productId: item.productId._id,
                              action: "decrement",
                            })
                          }
                          disabled={updateQuantityMutation.isPending}
                          className="rounded-full w-8 h-8"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantityMutation.mutate({
                              productId: item.productId._id,
                              action: "increment",
                            })
                          }
                          disabled={updateQuantityMutation.isPending}
                          className="rounded-full w-8 h-8"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Delete Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          deleteItemMutation.mutate(item.productId._id)
                        }
                        disabled={deleteItemMutation.isPending}
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
            <Card className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-indigo-100 sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-indigo-800">
                  Order Summary
                </CardTitle>
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
                  onClick={() => handlePayment()}
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
