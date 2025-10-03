/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useState } from "react";
import OtpDialog from "@/components/modal/OTPmodal";
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
    user?: string;
  };
  quantity: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface CartData {
  userId: string;
  products: ProductItem[];
  deliveryType: "pickup" | "delivery";
  paymentMethod: "cod" | "stripe";
}

export default function CheckoutPage() {
  const session = useSession();
  const user = session?.data?.user as any;
  const userId = user?.id;

  const queryClient = useQueryClient();
  const [deliveryType, setDeliveryType] = useState<"pickup" | "delivery">(
    "pickup"
  );
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "stripe">(
    "stripe"
  );

  // OTP dialog state
  const [openOTPDialog, setOpenOTPDialog] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  // Home delivery info state
  const [homeDeliveryModalOpen, setHomeDeliveryModalOpen] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState<any>(null);

  // Fetch cart
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

  // Mutations
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
    onError: (err: any) => toast.error(err.message),
  });

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
    onError: (err: any) => toast.error(err.message),
  });

  const items = cartData?.data || [];
  const subtotal = items.reduce(
    (sum: number, item: any) =>
      sum + item.productId.discountPrice * item.quantity,
    0
  );
  const shipping = deliveryType === "delivery" ? 100 : 0;
  const total = subtotal + shipping;

  // Stripe Payment
  const paymentMutation = useMutation({
    mutationFn: async (bodyData: CartData) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/payment/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyData),
        }
      );
      if (!res.ok) throw new Error("Failed to create checkout session");
      return res.json();
    },
    onSuccess: (data) => {
      if (data.url) window.location.href = data.url;
    },
    onError: (error) =>
      console.error("Payment session creation failed:", error),
  });

  // Handle Checkout
  const handleCheckout = async () => {
    if (deliveryType === "pickup" || paymentMethod === "stripe") {
      const body: CartData = {
        products: items,
        userId,
        deliveryType,
        paymentMethod: "stripe",
      };
      paymentMutation.mutate(body);
    } else if (paymentMethod === "cod") {
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
          setCurrentOrderId(data.orderId);
          setOpenOTPDialog(true);
          toast.success("OTP sent! Please verify to confirm order.");
        } else {
          toast.error(data.message);
        }
      } catch {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3 bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Your Cart</h2>
            {isLoading ? (
              <p className="text-center text-gray-500">Loading cart...</p>
            ) : items.length === 0 ? (
              <p className="text-gray-600 text-center">Your cart is empty.</p>
            ) : (
              items.map((item: any) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between py-3 border-b"
                >
                  <div className="flex items-center">
                    <Image
                      width={80}
                      height={80}
                      src={item.productId.image}
                      alt={item.productId.name}
                      className="w-16 h-16 object-cover mr-4"
                    />
                    <div>
                      <h3 className="text-sm font-medium">
                        {item.productId.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Tk. {item.productId.discountPrice}
                      </p>
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
                      className="w-8 h-8 rounded-full"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        deleteItemMutation.mutate(item.productId._id)
                      }
                      className="ml-4 text-red-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout */}
          <div className="w-full lg:w-1/3 bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Checkout</h3>

            {/* Delivery Option */}
            <div className="mb-4">
              <p className="font-medium">Delivery Option</p>
              <div className="space-y-2 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryType"
                    value="pickup"
                    checked={deliveryType === "pickup"}
                    onChange={() => {
                      setDeliveryType("pickup");
                      setPaymentMethod("stripe");
                      setDeliveryInfo(null);
                    }}
                  />
                  <span>Pickup (No Delivery)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryType"
                    value="delivery"
                    checked={deliveryType === "delivery"}
                    onChange={() => {
                      setDeliveryType("delivery");
                      setDeliveryInfo(null);
                    }}
                  />
                  <span>Home Delivery</span>
                </label>
              </div>
            </div>

            {/* Enter Delivery Info Button */}
            {deliveryType === "delivery" && !deliveryInfo && (
              <Button
                onClick={() => setHomeDeliveryModalOpen(true)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white my-2"
              >
                Enter Delivery Info
              </Button>
            )}

            {/* Payment Method (only after delivery info) */}
            {deliveryType === "delivery" && deliveryInfo && (
              <div className="mb-4">
                <p className="font-medium">Payment Method</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                    />
                    <span>Cash on Delivery</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="stripe"
                      checked={paymentMethod === "stripe"}
                      onChange={() => setPaymentMethod("stripe")}
                    />
                    <span>Pay with Stripe</span>
                  </label>
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="space-y-2 border-t pt-3">
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
              onClick={handleCheckout}
              className="w-full bg-yellow-400 text-white py-3 mt-4 rounded hover:bg-yellow-500"
            >
              {deliveryType === "delivery" && paymentMethod === "cod"
                ? "PLACE ORDER (COD)"
                : "PROCEED TO CHECKOUT"}
            </Button>
          </div>
        </div>
      </div>

      {/* OTP Dialog */}
      <OtpDialog
        open={openOTPDialog}
        onOpenChange={setOpenOTPDialog}
        orderId={currentOrderId}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["cart", userId] })
        }
      />

      {/* Home Delivery Modal */}
      <AddressFormModal
        open={homeDeliveryModalOpen}
        onOpenChange={setHomeDeliveryModalOpen}
        onSubmitSuccess={(data: any) => setDeliveryInfo(data)}
      />
    </main>
  );
}
