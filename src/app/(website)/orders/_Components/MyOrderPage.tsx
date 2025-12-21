/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { HelpCircle, Download, Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { ViewOrderModal } from "@/components/modal/ViewOrderModal";

interface OrderProduct {
  productId: {
    _id: string;
    name: string;
    image: string;
    discountPrice: number;
  };
  name: string;
  quantity: number;
  price: number;
  createdBy: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface Order {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  products: OrderProduct[];
  amount: number;
  status: string;
  deliveryStatus: string;
  deliveryType: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  deliveryInfo: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
}

const MyOrderPage = () => {
  const { data: session } = useSession();
  const user = session?.user as any;
  const [activeTab, setActiveTab] = useState<"pending" | "paid">("pending");

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery<{
    success: boolean;
    totalOrders: number;
    totalAmount: number;
    orders: Order[];
  }>({
    queryKey: ["orders", user?.email],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/payment/singleorderbyemailfrontend/${user?.email}`
      );
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
    enabled: !!user?.email,
  });

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (isError)
    return (
      <div className="p-8 text-center text-red-500">Failed to load orders</div>
    );

  const orders = response?.orders || [];

  // Filter orders based on payment status
  const pendingOrders = orders.filter((order) => order.status !== "paid");
  const paidOrders = orders.filter((order) => order.status === "paid");

  const displayOrders = activeTab === "pending" ? pendingOrders : paidOrders;


  return (
    <div className="min-h-screen bg-gray-50 mt-[150px]">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Your Orders</h1>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition">
                <HelpCircle className="w-4 h-4" /> Need Help?
              </button>
              <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition">
                <Download className="w-4 h-4" /> Download Invoice
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("pending")}
              className={`pb-3 px-4 font-medium text-sm transition-all relative ${
                activeTab === "pending"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Pending Orders
              <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
                {pendingOrders.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("paid")}
              className={`pb-3 px-4 font-medium text-sm transition-all relative ${
                activeTab === "paid"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Paid Orders
              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                {paidOrders.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {displayOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-600">
              {activeTab === "pending"
                ? "You don't have any pending orders at the moment."
                : "You don't have any paid orders yet."}
            </p>
          </div>
        ) : (
          displayOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Order Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-base font-bold text-gray-900">
                        Order #{order._id.slice(-8)}
                      </h2>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Placed on{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>

                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Delivery Status: </span>
                        <span
                          className={`font-semibold px-2 py-1 rounded ${
                            order.deliveryStatus === "pending"
                              ? "bg-yellow-50 text-yellow-700"
                              : order.deliveryStatus === "completed"
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-50 text-gray-600"
                          }`}
                        >
                          {order.deliveryStatus}
                        </span>
                      </div>
                      <div className="text-gray-400">|</div>
                      <div>
                        <span className="text-gray-600">Type: </span>
                        <span className="font-semibold text-gray-800">
                          {order.deliveryType}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      ${order.amount}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.products.length} item(s)
                    </p>
                  </div>
                </div>
              </div>

              {/* Products Preview */}
              <div className="p-6 space-y-4">
                {order.products.slice(0, 2).map((item) => (
                  <div
                    key={item.productId._id}
                    className="flex items-center gap-4"
                  >
                    <Image
                      width={300}
                      height={300}
                      src={item.productId.image}
                      alt={item.productId.name}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-gray-900">
                        {item.productId.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">{item.name}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <p className="text-sm font-semibold text-gray-900">
                          ${item.price}
                        </p>
                        <span className="text-gray-400">•</span>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Details Button - Only show for pending orders */}
              {order.status !== "paid" && (
                <div className="px-6 pb-6">             
                  <ViewOrderModal singleorderId={order._id} />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrderPage;