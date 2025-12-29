"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Mail, Globe, Calendar, Star, Award, Package, CheckCircle, Clock, ShoppingBag } from "lucide-react";

interface Seller {
  _id: string;
  name: string;
  logo: string;
  description: string;
  founded: string;
  rating: string;
  products: string;
  verified: boolean;
  featured: boolean;
  color: string;
  lightColor: string;
  website: string;
  email: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  image: string;
  stock: number;
  sales: number;
  status: string;
  category: {
    _id: string;
    name: string;
  };
  subCategory: {
    _id: string;
    name: string;
  };
  user: {
    _id: string;
    email: string;
    role: string;
  };
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Product[];
}

function SellerDetails() {
  const params = useParams();
  const id = params.id as string;

  const { data: sellerData, isLoading: sellerLoading, isError: sellerError } = useQuery<Seller>({
    queryKey: ["single-seller", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/seller/getsingelseller/${id}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch seller");
      }

      return res.json().then((data) => data.data);
    },
    enabled: !!id,
  });

  const sellerEmail = sellerData?.email;

  // Get all products filtered by seller email
  const {
    data: productsData,
    isLoading: productsLoading,
  } = useQuery<ApiResponse>({
    queryKey: ["seller-products", sellerEmail],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/food/getAllFood`
      );
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
    enabled: !!sellerEmail,
  });

  // Filter products by seller email
  const sellerProducts = productsData?.data?.filter(
    (product) => product.user.email === sellerEmail
  ) || [];

  if (sellerLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading seller details...</p>
        </div>
      </div>
    );
  }

  if (sellerError || !sellerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-3xl">✕</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Failed to Load Seller
          </h3>
          <p className="text-gray-600">
            We couldnt retrieve the seller information. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  // Logo rendering logic
  const isInitials = sellerData.logo.length <= 3 && !sellerData.logo.includes("http");
  const logoSrc =
    sellerData.logo && (sellerData.logo.startsWith("http") || sellerData.logo.startsWith("https"))
      ? sellerData.logo
      : null;

  // Calculate discount percentage
  const calculateDiscount = (price: number, discountPrice: number) => {
    return Math.round(((price - discountPrice) / price) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Card with Gradient Background */}
        <div
          className="bg-gradient-to-r rounded-3xl shadow-2xl overflow-hidden mb-8"
          style={{
            backgroundImage: `linear-gradient(135deg, ${sellerData.color}15 0%, ${sellerData.lightColor}25 100%)`,
          }}
        >
          <div className="p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Logo */}
              <div
                className="relative w-32 h-32 rounded-2xl shadow-xl flex-shrink-0"
                style={{
                  backgroundColor: isInitials ? sellerData.color : "white",
                }}
              >
                {isInitials ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <span
                      className="text-5xl font-bold"
                      style={{ color: "white" }}
                    >
                      {sellerData.logo}
                    </span>
                  </div>
                ) : logoSrc ? (
                  <Image
                    width={128}
                    height={128}
                    src={logoSrc}
                    alt={sellerData.name}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl">
                    <span className="text-4xl">🏪</span>
                  </div>
                )}
              </div>

              {/* Seller Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
                  <h1 className="text-4xl font-bold text-gray-900">
                    {sellerData.name}
                  </h1>
                  {sellerData.verified && (
                    <div className="bg-blue-500 p-1.5 rounded-full">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  )}
                  {sellerData.featured && (
                    <div className="bg-amber-500 p-1.5 rounded-full">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mb-4">
                  {/* Rating */}
                  <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span className="font-semibold text-gray-800">
                      {sellerData.rating}
                    </span>
                  </div>

                  {/* Products */}
                  <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                    <Package className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-800">
                      {sellerProducts.length} Products
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md ${
                      sellerData.status === "approved"
                        ? "bg-green-500 text-white"
                        : sellerData.status === "pending"
                        ? "bg-amber-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {sellerData.status === "approved" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                    <span className="font-semibold capitalize">
                      {sellerData.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* About Section - Takes 2 columns */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${sellerData.color}20` }}
              >
                <span className="text-2xl">📋</span>
              </div>
              About Seller
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              {sellerData.description}
            </p>
          </div>

          {/* Quick Info Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Quick Info
            </h2>
            <div className="space-y-5">
              {/* Founded */}
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${sellerData.color}15` }}
                >
                  <Calendar
                    className="w-5 h-5"
                    style={{ color: sellerData.color }}
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Founded</p>
                  <p className="text-gray-900 font-semibold">{sellerData.founded}</p>
                </div>
              </div>

              {/* Website */}
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${sellerData.color}15` }}
                >
                  <Globe className="w-5 h-5" style={{ color: sellerData.color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500 font-medium">Website</p>
                  <a
                    href={sellerData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-semibold underline break-all"
                  >
                    Visit Site
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${sellerData.color}15` }}
                >
                  <Mail className="w-5 h-5" style={{ color: sellerData.color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500 font-medium">Email</p>
                  <a
                    href={`mailto:${sellerData.email}`}
                    className="text-gray-900 font-semibold hover:text-blue-600 break-all"
                  >
                    {sellerData.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {sellerData.verified && (
              <div className="flex items-center gap-2 bg-blue-50 px-6 py-3 rounded-xl border-2 border-blue-200">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">
                  Verified Seller
                </span>
              </div>
            )}
            {sellerData.featured && (
              <div className="flex items-center gap-2 bg-amber-50 px-6 py-3 rounded-xl border-2 border-amber-200">
                <Award className="w-5 h-5 text-amber-600" />
                <span className="font-semibold text-amber-900">
                  Featured Seller
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-green-50 px-6 py-3 rounded-xl border-2 border-green-200">
              <Package className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-900">
                {sellerProducts.length} Products Available
              </span>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${sellerData.color}20` }}
            >
              <ShoppingBag className="w-6 h-6" style={{ color: sellerData.color }} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              Products by {sellerData.name}
            </h2>
          </div>

          {productsLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : sellerProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No products available yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sellerProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white border-2 border-gray-100 rounded-xl overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 group"
                >
                  {/* Product Image */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={300}
                      height={200}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {product.discountPrice < product.price && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        {calculateDiscount(product.price, product.discountPrice)}% OFF
                      </div>
                    )}
                    {product.status === "approved" && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        ✓ Approved
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    {/* Category Badge */}
                    <div className="flex gap-2 mb-2">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                        {product.category.name}
                      </span>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                        {product.subCategory.name}
                      </span>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                      {product.name}
                    </h3>

                    {/* Price Section */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl font-bold text-green-600">
                        ${product.discountPrice}
                      </span>
                      {product.discountPrice < product.price && (
                        <span className="text-sm text-gray-400 line-through">
                          ${product.price}
                        </span>
                      )}
                    </div>

                    {/* Stock & Sales */}
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        Stock: {product.stock}
                      </span>
                      <span className="flex items-center gap-1">
                        <ShoppingBag className="w-4 h-4" />
                        Sold: {product.sales}
                      </span>
                    </div>

                    {/* View Button */}
                    <button
                      className="w-full py-2 rounded-lg font-semibold transition-all duration-300"
                      style={{
                        backgroundColor: sellerData.color,
                        color: "white",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = sellerData.lightColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = sellerData.color;
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SellerDetails;