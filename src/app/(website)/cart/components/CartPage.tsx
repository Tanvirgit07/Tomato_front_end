/* eslint-disable @typescript-eslint/no-explicit-any */
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
    discountPrice: number;
    image: string;
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
  const subtotal = items.reduce(
    (sum: number, item: any) =>
      sum + item.productId.discountPrice * item.quantity,
    0
  );
  const tax = 0; // No tax shown in the image
  const shipping = 100; // Fixed shipping cost from image
  const total = subtotal + shipping;

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
    paymentMutation.mutate(body);
  };

  return (
    <main className="min-h-screen bg-gray-100 py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3 bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  onChange={() => {}}
                  checked={items.length > 0}
                />
                <span className="text-yellow-500 font-semibold">
                  Select All ({items.length} Items)
                </span>
              </div>
              <span className="text-lg font-bold">Total: {total} TK</span>
            </div>
            {isLoading ? (
              <p className="text-center text-gray-500">Loading cart...</p>
            ) : items.length === 0 ? (
              <p className="text-gray-600 text-center">Your cart is empty.</p>
            ) : (
              items.map((item: any) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between py-2 border-b"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={true}
                      onChange={() => {}}
                    />
                    <Image
                      width={80}
                      height={80}
                      src={item.productId.image}
                      alt={item.productId.name}
                      className="w-16 h-16 object-cover mr-4"
                    />
                    <div>
                      <h3 className="text-sm font-medium">{item.productId.name}</h3>
                    </div>
                  </div>
                  <div className="flex items-center">
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
                      className="w-8 h-8 rounded-full"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-semibold mx-2">
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
                      className="w-8 h-8 rounded-full"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <span className="ml-4 text-sm font-semibold">Tk. {item.productId.discountPrice}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteItemMutation.mutate(item.productId._id)}
                      disabled={deleteItemMutation.isPending}
                      className="ml-4 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Payment Details */}
          <div className="w-full lg:w-1/3 bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{subtotal} TK</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping} TK</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{total} TK</span>
              </div>
            </div>
            <Button
              onClick={handlePayment}
              className="w-full bg-yellow-400 text-white py-3 mt-4 rounded hover:bg-yellow-500"
            >
              PROCEED TO CHECKOUT
            </Button>
            <Button
              variant="link"
              className="w-full text-orange-500 mt-2"
              onClick={() => {}}
            >
              ← Return to Shopping
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}