"use client";
import React from "react";
import { HelpCircle, Download, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

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

  const { data: response, isLoading, isError } = useQuery<{
    success: boolean;
    totalOrders: number;
    totalAmount: number;
    orders: Order[];
  }>({
    queryKey: ["orders", user?.email],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/payment/singleorderbyemail/${user?.email}`
      );
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
    enabled: !!user?.email,
  });

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (isError) return <div className="p-8 text-center text-red-500">Failed to load orders</div>;

  const orders = response?.orders || [];

  return (
    <div className="min-h-screen bg-gray-50 mt-[150px]">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          <h1 className="text-xl font-semibold">Your Orders ({orders.length})</h1>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
              <HelpCircle className="w-4 h-4" /> Need Help?
            </button>
            <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
              <Download className="w-4 h-4" /> Download Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            {/* Order Header */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold">Order ID: {order._id}</h2>
                <p className="text-sm text-gray-600">
                  Placed on {new Date(order.createdAt).toLocaleDateString()} | Total: ${order.amount}
                </p>

                {/* Delivery Status & Type */}
                <p className="text-sm mt-1">
                  Delivery Status:{" "}
                  <span
                    className={`font-semibold px-2 py-1 rounded ${
                      order.deliveryStatus === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.deliveryStatus === "completed" || order.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {order.deliveryStatus}
                  </span>{" "}
                  | Type:{" "}
                  <span className="font-semibold text-gray-800">{order.deliveryType}</span>
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded text-xs font-medium ${
                  order.status === "paid"
                    ? "bg-green-600 text-white"
                    : "bg-yellow-500 text-white"
                }`}
              >
                {order.status.toUpperCase()}
              </span>
            </div>

            {/* Delivery Info */}
            <div className="bg-gray-50 p-4 rounded border border-gray-100">
              <h3 className="font-semibold text-sm mb-2">Delivery Info</h3>
              <p className="text-sm text-gray-700">{order?.deliveryInfo?.fullName}</p>
              <p className="text-sm text-gray-700">{order?.deliveryInfo?.phone}</p>
              <p className="text-sm text-gray-700">
                {order?.deliveryInfo?.address}, {order?.deliveryInfo?.city}, {order?.deliveryInfo?.postalCode}
              </p>
            </div>

            {/* Products List */}
            <div className="space-y-4">
              {order.products.map((item) => (
                <div
                  key={item.productId._id}
                  className="flex items-center gap-4 border-b pb-4 last:border-b-0"
                >
                  <img
                    src={item.productId.image}
                    alt={item.productId.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.productId.name}</h4>
                    <p className="text-xs text-gray-500">{item.name}</p>
                    <p className="text-sm font-semibold">${item.price}</p>
                    <p className="text-xs text-gray-400">
                      Seller: {item.createdBy.name} ({item.createdBy.role})
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrderPage;
