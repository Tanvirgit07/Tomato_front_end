"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingBasket,
  Menu,
  X,
  Heart,
  CircleUser,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

// Define interfaces for better TypeScript support
interface User {
  id: string;
  name?: string;
  email?: string;
}

interface CartItem {
  id: string;
  quantity: number;
}

interface WishlistItem {
  id: string;
}

interface CartResponse {
  data: CartItem[];
}

interface WishlistResponse {
  data: WishlistItem[];
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const { data: session, status } = useSession();
  const user = session?.user as User | undefined;
  const userId = user?.id;
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const { data: cartData, isLoading: cartLoading } = useQuery<CartResponse>({
    queryKey: ["cart", userId],
    queryFn: async (): Promise<CartResponse> => {
      if (!userId) throw new Error("User not authenticated");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/cart/cartuser/${userId}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch cart data");
      }

      return res.json();
    },
  });

  const { data: wishlist, isLoading: wishlistLoading } =
    useQuery<WishlistResponse>({
      queryKey: ["wishlist", userId],
      queryFn: async (): Promise<WishlistResponse> => {
        if (!userId) throw new Error("User not authenticated");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/wishlist/getwishlist/${userId}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch wishlist data");
        }

        return res.json();
      },
      enabled: !!userId && status === "authenticated",
    });

  const totalQuantity =
    cartData?.data?.reduce(
      (sum: number, item: CartItem) => sum + (item.quantity || 0),
      0
    ) || 0;

  const totalWishlist = wishlist?.data?.length || 0;

  const navigationItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "About Us", href: "/about-us" },
    { label: "Blogs", href: "/blog" },
    { label: "Become a Seller", href: "/become-seller" }
  ];

  const handleSearch = (e: React.FormEvent): void => {
    e.preventDefault();
    if (searchValue.trim()) {
      // Handle search logic here
      console.log("Searching for:", searchValue);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-lg shadow-2xl border-b border-gray-200/50"
          : "bg-white shadow-xl border-b border-gray-100"
      }`}
    >
      {/* Top banner for promotions */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white text-center py-2 text-sm font-medium">
        <div className="flex items-center justify-center gap-2 animate-pulse">
          <Sparkles className="h-4 w-4" />
          <span>🎉 Free shipping on orders over $50! Limited time offer</span>
          <Sparkles className="h-4 w-4" />
        </div>
      </div>

      <div className="container mx-auto">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-[50px] w-[50px] flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <Image
                  src="/images/source.gif"
                  width={45}
                  height={45}
                  className="object-cover rounded-full relative z-10 group-hover:scale-110 transition-transform duration-300"
                  alt="Tomato logo"
                  priority
                />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent group-hover:from-red-700 group-hover:to-orange-600 transition-all duration-300 tracking-tight">
                  Tomato.
                </h1>
                <p className="text-xs text-gray-500 font-medium -mt-1">
                  Fresh & Organic
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-full text-sm lg:text-base font-semibold transition-all duration-300 group ${
                    isActive
                      ? "text-white bg-gradient-to-r from-red-600 to-red-500 shadow-lg shadow-red-500/25"
                      : "text-gray-700 hover:text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50"
                  }`}
                >
                  {item.label}
                  {!isActive && (
                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600 to-red-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-sm mx-6">
            <form onSubmit={handleSearch} className="w-full relative group">
              <Input
                type="text"
                placeholder="Search fresh products..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full pr-12 rounded-full border-2 border-gray-200 focus:border-red-400 focus:ring-red-400/20 transition-all duration-300 bg-gray-50/50 group-hover:bg-white"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-lg hover:shadow-red-500/25 transition-all duration-300"
              >
                <Search className="h-4 w-4 text-white" />
              </Button>
            </form>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-3">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative group p-2 rounded-full hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transition-all duration-300"
            >
              <Heart className="h-6 w-6 text-gray-700 group-hover:text-red-600 group-hover:scale-110 transition-all duration-300" />
              {totalWishlist > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-lg">
                  {totalWishlist}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative group p-2 rounded-full hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transition-all duration-300"
            >
              <ShoppingBasket className="h-6 w-6 text-gray-700 group-hover:text-red-600 group-hover:scale-110 transition-all duration-300" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce shadow-lg">
                  {totalQuantity}
                </span>
              )}
            </Link>

            {/* User Profile */}
            <Link
              href="/account"
              className="group p-2 rounded-full hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transition-all duration-300"
            >
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="relative">
                    {/* Avatar circle */}
                    <div className="h-9 w-9 rounded-full bg-gradient-to-r from-red-600 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                      {user.name?.charAt(0).toUpperCase() ||
                        user.email?.charAt(0).toUpperCase() ||
                        "U"}
                    </div>
                    {/* Tooltip effect */}
                    <span className="absolute left-1/2 -translate-x-1/2 mt-2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      {user.name || user.email}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CircleUser className="h-6 w-6 text-gray-600 group-hover:text-red-600 transition-colors duration-300" />
                </div>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-700 rotate-180 transition-transform duration-300" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-200 px-4 py-4 space-y-2">
          {/* Mobile Search */}
          <div className="mb-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full pr-12 rounded-full border-2 border-gray-200 focus:border-red-400 bg-white"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-gradient-to-r from-red-600 to-red-500"
              >
                <Search className="h-4 w-4 text-white" />
              </Button>
            </form>
          </div>

          {/* Mobile Navigation Links */}
          {navigationItems.map(({ label, href }, index) => {
            const isActive = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className={`block px-4 py-3 text-base font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                  isActive
                    ? "text-white bg-gradient-to-r from-red-600 to-red-500 shadow-lg"
                    : "text-gray-700 hover:text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Loading indicator for cart/wishlist */}
      {(cartLoading || wishlistLoading) && (
        <div className="absolute top-full left-0 right-0 h-1 bg-gray-200">
          <div className="h-full bg-gradient-to-r from-red-600 to-red-500 animate-pulse"></div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
