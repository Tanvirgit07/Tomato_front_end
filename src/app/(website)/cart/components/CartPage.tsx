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
    if (deliveryType === "delivery" && !deliveryInfo) {
      toast.error("Please enter your delivery address");
      setHomeDeliveryModalOpen(true);
      return;
    }

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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center sm:text-left mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 flex flex-col sm:flex-row items-center gap-4">
            <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-500" />
            <span>Checkout</span>
          </h1>
          <p className="text-gray-600 mt-3 text-base sm:text-lg">Review your items and complete your purchase</p>
        </div>

        {/* Main Grid - Stack on mobile, side-by-side on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Your Cart Items</h2>
                  <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-bold">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </span>
                </div>
              </div>

              {isLoading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-yellow-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading your cart...</p>
                </div>
              ) : items.length === 0 ? (
                <div className="p-16 text-center">
                  <ShoppingBag className="mx-auto text-gray-300 mb-6 w-20 h-20" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-600">Add some products to proceed with checkout</p>
                </div>
              ) : (
                <div className="p-6 sm:p-8 space-y-5">
                  {items.map((item: any) => (
                    <div
                      key={item._id}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-5 p-5 bg-gray-50 rounded-2xl hover:shadow-md transition-all duration-300"
                    >
                      {/* Image */}
                      <div className="relative w-full h-40 sm:h-full">
                        <Image
                          src={item.productId.image}
                          alt={item.productId.name}
                          fill
                          className="object-cover rounded-xl"
                        />
                      </div>

                      {/* Details */}
                      <div className="sm:col-span-2 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900 text-base sm:text-lg line-clamp-2">
                            {item.productId.name}
                          </h3>
                          <p className="text-2xl font-bold text-yellow-600 mt-2">
                            ৳{item.productId.discountPrice}
                          </p>
                        </div>

                        {/* Quantity & Delete */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-10 w-10 rounded-xl"
                              onClick={() =>
                                updateQuantityMutation.mutate({
                                  productId: item.productId._id,
                                  action: "decrement",
                                })
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={16} />
                            </Button>
                            <span className="text-lg font-bold w-12 text-center">{item.quantity}</span>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-10 w-10 rounded-xl"
                              onClick={() =>
                                updateQuantityMutation.mutate({
                                  productId: item.productId._id,
                                  action: "increment",
                                })
                              }
                            >
                              <Plus size={16} />
                            </Button>
                          </div>

                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-red-500 hover:bg-red-50 h-10 w-10 rounded-xl"
                            onClick={() => deleteItemMutation.mutate(item.productId._id)}
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Order Summary</h3>

              {/* Delivery Options */}
              <div className="space-y-4 mb-8">
                <p className="font-semibold text-gray-800">Choose Delivery Method</p>
                <div className="space-y-3">
                  <label
                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      deliveryType === "pickup"
                        ? "border-yellow-500 bg-yellow-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryType === "pickup"}
                      onChange={() => {
                        setDeliveryType("pickup");
                        setPaymentMethod("stripe");
                        setDeliveryInfo(null);
                      }}
                      className="w-5 h-5 text-yellow-500"
                    />
                    <Store className="w-6 h-6 text-gray-700" />
                    <div>
                      <p className="font-semibold text-gray-900">Store Pickup</p>
                      <p className="text-sm text-gray-600">Free • Collect from store</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      deliveryType === "delivery"
                        ? "border-yellow-500 bg-yellow-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryType === "delivery"}
                      onChange={() => setDeliveryType("delivery")}
                      className="w-5 h-5 text-yellow-500"
                    />
                    <Truck className="w-6 h-6 text-gray-700" />
                    <div>
                      <p className="font-semibold text-gray-900">Home Delivery</p>
                      <p className="text-sm text-gray-600">৳100 • Delivered to your door</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Address Button / Info */}
              {deliveryType === "delivery" && (
                <>
                  {!deliveryInfo ? (
                    <Button
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-2xl h-14 text-lg shadow-md"
                      onClick={() => setHomeDeliveryModalOpen(true)}
                    >
                      <MapPin className="mr-3" size={20} />
                      Add Delivery Address
                    </Button>
                  ) : (
                    <div className="mb-6 p-5 bg-green-50 border-2 border-green-200 rounded-2xl">
                      <div className="flex justify-between items-start mb-3">
                        <p className="font-semibold text-green-800 flex items-center gap-2">
                          <MapPin size={18} /> Delivery Address
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setHomeDeliveryModalOpen(true)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="text-sm text-gray-700 space-y-1">
                        <p className="font-medium">{deliveryInfo.fullName}</p>
                        <p>{deliveryInfo.phone}</p>
                        <p>{deliveryInfo.address}, {deliveryInfo.city}</p>
                        <p>{deliveryInfo.postalCode}</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Payment Method - Only for Home Delivery */}
              {deliveryType === "delivery" && deliveryInfo && (
                <div className="mb-8">
                  <p className="font-semibold text-gray-800 mb-4">Payment Method</p>
                  <div className="space-y-3">
                    <label
                      className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                        paymentMethod === "cod"
                          ? "border-yellow-500 bg-yellow-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="w-5 h-5 text-yellow-500"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">Cash on Delivery</p>
                        <p className="text-sm text-gray-600">Pay when you receive</p>
                      </div>
                    </label>

                    <label
                      className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                        paymentMethod === "stripe"
                          ? "border-yellow-500 bg-yellow-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={paymentMethod === "stripe"}
                        onChange={() => setPaymentMethod("stripe")}
                        className="w-5 h-5 text-yellow-500"
                      />
                      <CreditCard className="w-6 h-6 text-gray-700" />
                      <div>
                        <p className="font-semibold text-gray-900">Online Payment</p>
                        <p className="text-sm text-gray-600">Secure card payment</p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Price Summary */}
              <div className="border-t-2 border-dashed border-gray-200 pt-6 space-y-4">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="font-bold">৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-700">Shipping</span>
                  <span className="font-bold">{shipping === 0 ? "Free" : `৳${shipping}`}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold pt-4 border-t border-gray-300">
                  <span>Total</span>
                  <span className="text-yellow-600">৳{total}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                disabled={items.length === 0 || updateQuantityMutation.isPending || stripeMutation.isPending}
                className="w-full mt-8 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold text-xl h-16 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                {deliveryType === "delivery" && paymentMethod === "cod"
                  ? "Place Order (Cash on Delivery)"
                  : "Proceed to Payment"}
              </Button>

              <p className="text-center text-xs text-gray-500 mt-6">
                🔒 Secure checkout • Your information is encrypted and protected
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <AddressFormModal
        open={homeDeliveryModalOpen}
        onOpenChange={setHomeDeliveryModalOpen}
        onSubmitSuccess={(data: any) => setDeliveryInfo(data)}
      />
    </main>
  );
}