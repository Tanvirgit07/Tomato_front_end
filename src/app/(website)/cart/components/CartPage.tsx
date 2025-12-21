/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus, ShoppingBag, MapPin, CreditCard, Truck, Store } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useState } from "react";
import AddressFormModal from "@/components/modal/AddressFormModal";

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
}

interface CartData {
  userId: string;
  products: ProductItem[];
  deliveryType: "pickup" | "delivery";
  paymentMethod: "cod" | "stripe";
  deliveryInfo?: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    location: {
      lat: number;
      lng: number;
    };
  };
}

export default function CheckoutPage() {
  const session = useSession();
  const user = session?.data?.user as any;
  const userId = user?.id;

  const queryClient = useQueryClient();

  const [deliveryType, setDeliveryType] = useState<"pickup" | "delivery">("pickup");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "stripe">("stripe");
  const [homeDeliveryModalOpen, setHomeDeliveryModalOpen] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState<any>(null);

  // Fetch Cart
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

  // Update Quantity
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
  });

  // Delete Item
  const deleteItemMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/cart/deletecartitem/${userId}/${productId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete item");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
  });

  const items = cartData?.data || [];
  const subtotal = items.reduce(
    (sum: number, item: any) => sum + item.productId.discountPrice * item.quantity,
    0
  );
  const shipping = deliveryType === "delivery" ? 100 : 0;
  const total = subtotal + shipping;

  // Stripe Payment
  const stripeMutation = useMutation({
    mutationFn: async (bodyData: CartData) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/payment/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyData),
        }
      );
      if (!res.ok) throw new Error("Stripe session failed");
      return res.json();
    },
    onSuccess: (data) => {
      if (data.url) window.location.href = data.url;
    },
  });

  // Checkout Handler
  const handleCheckout = async () => {
    // STRIPE
    if (deliveryType === "pickup" || paymentMethod === "stripe") {
      stripeMutation.mutate({
        userId,
        products: items,
        deliveryType,
        paymentMethod: "stripe",
        deliveryInfo: deliveryInfo || undefined,
      });
      return;
    }

    // CASH ON DELIVERY
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/payment/cod`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            products: items,
            deliveryType,
            deliveryInfo,
            email: user?.email,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Order placed successfully!");
        queryClient.invalidateQueries({ queryKey: ["cart", userId] });
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingBag className="text-yellow-500" size={36} />
            Checkout
          </h1>
          <p className="text-gray-600 mt-2">Complete your purchase</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items - Left Side */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag className="mx-auto text-gray-300 mb-4" size={64} />
                  <p className="text-gray-500 text-lg">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item: any) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="relative w-24 h-24 flex-shrink-0 bg-white rounded-lg overflow-hidden shadow-sm">
                        <Image
                          src={item.productId.image}
                          alt={item.productId.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {item.productId.name}
                        </h3>
                        <p className="text-yellow-600 font-bold text-lg mt-1">
                          ৳{item.productId.discountPrice}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-lg hover:bg-yellow-50 hover:border-yellow-300"
                          onClick={() =>
                            updateQuantityMutation.mutate({
                              productId: item.productId._id,
                              action: "decrement",
                            })
                          }
                        >
                          <Minus size={14} />
                        </Button>

                        <span className="w-12 text-center font-semibold text-gray-900">
                          {item.quantity}
                        </span>

                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-lg hover:bg-yellow-50 hover:border-yellow-300"
                          onClick={() =>
                            updateQuantityMutation.mutate({
                              productId: item.productId._id,
                              action: "increment",
                            })
                          }
                        >
                          <Plus size={14} />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 ml-2 text-red-500 hover:bg-red-50 rounded-lg"
                          onClick={() => deleteItemMutation.mutate(item.productId._id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary - Right Side */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

              {/* Delivery Options */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">Delivery Method</p>
                <div className="space-y-3">
                  <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    deliveryType === "pickup"
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}>
                    <input
                      type="radio"
                      checked={deliveryType === "pickup"}
                      onChange={() => {
                        setDeliveryType("pickup");
                        setPaymentMethod("stripe");
                        setDeliveryInfo(null);
                      }}
                      className="w-4 h-4 text-yellow-500"
                    />
                    <Store className="text-gray-600" size={20} />
                    <span className="font-medium text-gray-900">Store Pickup</span>
                  </label>

                  <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    deliveryType === "delivery"
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}>
                    <input
                      type="radio"
                      checked={deliveryType === "delivery"}
                      onChange={() => setDeliveryType("delivery")}
                      className="w-4 h-4 text-yellow-500"
                    />
                    <Truck className="text-gray-600" size={20} />
                    <span className="font-medium text-gray-900">Home Delivery</span>
                  </label>
                </div>
              </div>

              {/* Delivery Info Button */}
              {deliveryType === "delivery" && !deliveryInfo && (
                <Button
                  className="w-full mb-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl h-12 font-semibold"
                  onClick={() => setHomeDeliveryModalOpen(true)}
                >
                  <MapPin size={18} className="mr-2" />
                  Enter Delivery Address
                </Button>
              )}

              {/* Delivery Info Display */}
              {deliveryType === "delivery" && deliveryInfo && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-green-600 mt-1" />
                      <p className="text-sm font-semibold text-gray-900">Delivery Address</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 text-xs text-blue-600"
                      onClick={() => setHomeDeliveryModalOpen(true)}
                    >
                      Edit
                    </Button>
                  </div>
                  <p className="text-sm text-gray-700 ml-6">
                    {deliveryInfo.fullName}<br />
                    {deliveryInfo.phone}<br />
                    {deliveryInfo.address}, {deliveryInfo.city}
                  </p>
                </div>
              )}

              {/* Payment Method */}
              {deliveryType === "delivery" && deliveryInfo && (
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Payment Method</p>
                  <div className="space-y-3">
                    <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "border-yellow-500 bg-yellow-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}>
                      <input
                        type="radio"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="w-4 h-4 text-yellow-500"
                      />
                      <span className="font-medium text-gray-900">Cash on Delivery</span>
                    </label>

                    <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "stripe"
                        ? "border-yellow-500 bg-yellow-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}>
                      <input
                        type="radio"
                        checked={paymentMethod === "stripe"}
                        onChange={() => setPaymentMethod("stripe")}
                        className="w-4 h-4 text-yellow-500"
                      />
                      <CreditCard className="text-gray-600" size={20} />
                      <span className="font-medium text-gray-900">Online Payment</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-semibold">{shipping === 0 ? 'Free' : `৳${shipping}`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-yellow-600">৳{total}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold rounded-xl h-14 text-lg shadow-lg hover:shadow-xl transition-all"
                onClick={handleCheckout}
                disabled={items.length === 0}
              >
                {deliveryType === "delivery" && paymentMethod === "cod"
                  ? "Place Order (COD)"
                  : "Proceed to Payment"}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Your payment information is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>

      <AddressFormModal
        open={homeDeliveryModalOpen}
        onOpenChange={setHomeDeliveryModalOpen}
        onSubmitSuccess={(data: any) => setDeliveryInfo(data)}
      />
    </main>
  );
}