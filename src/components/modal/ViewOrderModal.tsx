/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import {
  User,
  Phone,
  MapPin,
  CreditCard,
  Package,
  Truck,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  Navigation,
  Copy,
  Check,
} from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState } from "react";

// Dynamically import SimpleMap to avoid SSR issues
const SimpleMap = dynamic(() => import("@/components/map/CustomarMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div>
        <p className="text-gray-600 font-medium">Loading map...</p>
      </div>
    </div>
  ),
});

type ViewOrderModalProps = {
  singleorderId: string;
};

export function ViewOrderModal({ singleorderId }: ViewOrderModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["single-order", singleorderId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/payment/singeorder/${singleorderId}`
      );
      if (!res.ok) throw new Error("Failed to fetch order");
      return res.json();
    },
    enabled: !!singleorderId && isOpen,
  });

  const order = data?.order;
  const rider = data?.rider;

  // Customer position from deliveryInfo location
  const customerPosition: [number, number] = [
    order?.deliveryInfo?.location?.lat || 23.8103,
    order?.deliveryInfo?.location?.lng || 90.4125,
  ];

  // Rider position (if available from API)
  const riderPosition: [number, number] | null = rider
    ? [rider.latitude || 23.8103, rider.longitude || 90.4125]
    : null;

  const copyOrderId = () => {
    navigator.clipboard.writeText(order._id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      paid: "from-green-500 to-emerald-600",
      pending: "from-yellow-500 to-amber-600",
      failed: "from-red-500 to-rose-600",
    };
    return colors[status] || "from-gray-500 to-gray-600";
  };

  const getDeliveryStatusColor = (status: string) => {
    const colors: any = {
      in_transit: "from-blue-500 to-indigo-600",
      delivered: "from-green-500 to-emerald-600",
      pending: "from-orange-500 to-amber-600",
      cancelled: "from-red-500 to-rose-600",
    };
    return colors[status] || "from-gray-500 to-gray-600";
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className="group relative w-full py-3 px-4 border-2 border-gray-200 rounded-xl 
               text-sm font-semibold text-gray-700 
               hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700
               transition-all duration-300 ease-in-out
               shadow-sm hover:shadow-md
               overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <Package className="w-4 h-4" />
            View Full Details
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        </button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-[95vw] lg:max-w-5xl max-h-[95vh] overflow-hidden rounded-3xl p-0 gap-0 border-0 shadow-2xl">
        {/* Enhanced Header with Animated Background */}
        <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 px-6 sm:px-8 py-8 overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl animate-pulse delay-700"></div>
          </div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA4KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

          <div className="relative">
            <DialogTitle className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <Package className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              Order Details
            </DialogTitle>
            <DialogDescription className="text-blue-100 text-sm sm:text-base">
              Complete order information with real-time tracking
            </DialogDescription>
          </div>
        </div>

        {/* Content Area with Enhanced Styling */}
        <div className="overflow-y-auto max-h-[calc(95vh-180px)] px-4 sm:px-8 py-6 bg-gradient-to-br from-gray-50 to-blue-50">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-t-4 border-blue-600"></div>
                <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-4 border-blue-400 opacity-20"></div>
              </div>
              <p className="text-gray-600 font-semibold text-lg mt-6 animate-pulse">
                Loading order details...
              </p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="bg-red-100 rounded-full p-6 mb-4 animate-bounce">
                <AlertCircle className="w-16 h-16 text-red-600" />
              </div>
              <p className="text-red-600 font-bold text-xl">
                Failed to load order details
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Please check your connection and try again
              </p>
            </div>
          ) : (
            order && (
              <div className="space-y-6">
                {/* Quick Status Overview */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                          Order Status
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-white text-sm font-bold shadow-lg bg-gradient-to-r ${getStatusColor(
                              order.status
                            )}`}
                          >
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                            {order.status.toUpperCase()}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-white text-sm font-bold shadow-lg bg-gradient-to-r ${getDeliveryStatusColor(
                              order.deliveryStatus
                            )}`}
                          >
                            <Truck className="w-3.5 h-3.5" />
                            {order.deliveryStatus.replace("_", " ").toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 bg-gray-100 px-4 py-2 rounded-xl">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Information - Enhanced */}
                <section className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-purple-100">
                    <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 flex-1">
                      Customer Information
                    </h3>
                    <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="group flex items-start gap-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition-all duration-300">
                      <div className="p-2.5 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                        <User className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-1.5">
                          Full Name
                        </p>
                        <p className="text-base font-bold text-gray-800">
                          {order.deliveryInfo?.fullName}
                        </p>
                      </div>
                    </div>
                    <div className="group flex items-start gap-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition-all duration-300">
                      <div className="p-2.5 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                        <Phone className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-1.5">
                          Phone Number
                        </p>
                        <p className="text-base font-bold text-gray-800">
                          {order.deliveryInfo?.phone}
                        </p>
                      </div>
                    </div>
                    <div className="group md:col-span-2 flex items-start gap-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition-all duration-300">
                      <div className="p-2.5 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                        <MapPin className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-1.5">
                          Delivery Address
                        </p>
                        <p className="text-base font-bold text-gray-800">
                          {order.deliveryInfo?.address}, {order.deliveryInfo?.city}
                        </p>
                      </div>
                    </div>
                    <div className="group flex items-start gap-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition-all duration-300">
                      <div className="p-2.5 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                        <Mail className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-1.5">
                          Postal Code
                        </p>
                        <p className="text-base font-bold text-gray-800">
                          {order.deliveryInfo?.postalCode}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Order Information - Enhanced */}
                <section className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-blue-100">
                    <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-lg">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 flex-1">
                      Order Information
                    </h3>
                    <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-blue-100">
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <Package className="w-3.5 h-3.5" />
                        Order ID
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-gray-800 truncate flex-1">
                          {order._id.slice(0, 12)}...
                        </p>
                        <button
                          onClick={copyOrderId}
                          className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Copy Order ID"
                        >
                          {copiedId ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-blue-600" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-green-200">
                      <p className="text-xs font-bold text-green-600 uppercase tracking-wide mb-3">
                        Total Amount
                      </p>
                      <p className="text-3xl font-black text-green-600">
                        {order.amount} ৳
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-blue-100">
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <CreditCard className="w-3.5 h-3.5" />
                        Payment Method
                      </p>
                      <p className="text-lg font-bold text-gray-800 uppercase">
                        {order.paymentMethod}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-blue-100">
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <Truck className="w-3.5 h-3.5" />
                        Delivery Type
                      </p>
                      <p className="text-lg font-bold text-gray-800 capitalize">
                        {order.deliveryType}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-blue-100">
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-3">
                        Payment Status
                      </p>
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-bold shadow-lg bg-gradient-to-r ${getStatusColor(
                          order.status
                        )}`}
                      >
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-blue-100">
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-3">
                        Delivery Status
                      </p>
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-bold shadow-lg bg-gradient-to-r ${getDeliveryStatusColor(
                          order.deliveryStatus
                        )}`}
                      >
                        <Truck className="w-3.5 h-3.5" />
                        {order.deliveryStatus.replace("_", " ").toUpperCase()}
                      </span>
                    </div>
                  </div>
                </section>

                {/* Product List - Enhanced */}
                <section className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-green-100">
                    <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl shadow-lg">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 flex-1">
                      Products Ordered
                    </h3>
                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                      {order.products?.length} {order.products?.length === 1 ? "item" : "items"}
                    </span>
                  </div>
                  <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                    {order.products?.map((item: any, index: number) => (
                      <div
                        key={item._id}
                        className="group flex items-center gap-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border-2 border-green-100 hover:border-green-300 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                      >
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden border-3 border-green-200 shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                          <Image
                            src={item.productId?.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-md">
                            #{index + 1}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 text-lg mb-2 truncate">
                            {item.name}
                          </p>
                          <div className="flex items-center gap-4">
                            <span className="inline-flex items-center gap-2 bg-white text-gray-700 font-semibold px-3 py-1.5 rounded-lg shadow-sm border border-green-200">
                              <span className="text-xs">Qty:</span>
                              <span className="bg-green-600 text-white font-bold px-2 py-0.5 rounded-md">
                                {item.quantity}
                              </span>
                            </span>
                            <span className="text-green-700 font-black text-xl">
                              {item.price} ৳
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Map Section - Enhanced */}
                <section className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-orange-100">
                    <div className="p-3 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl shadow-lg">
                      <Navigation className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 flex-1">
                      Live Tracking
                    </h3>
                    <div className="flex items-center gap-2 bg-orange-100 px-3 py-1.5 rounded-full">
                      <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></div>
                      <span className="text-xs font-bold text-orange-700">ACTIVE</span>
                    </div>
                  </div>

                  <div className="w-full h-96 rounded-2xl overflow-hidden border-3 border-orange-200 shadow-2xl">
                    <SimpleMap
                      key={`map-${singleorderId}-${isOpen}`}
                      position={customerPosition}
                      riderPosition={riderPosition}
                    />
                  </div>
                </section>
              </div>
            )
          )}
        </div>

        {/* Enhanced Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 sm:px-8 py-5 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="font-medium">Order verified and secured</span>
          </div>
          <DialogClose asChild>
            <Button 
              variant="outline" 
              className="px-6 py-2.5 font-semibold rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}