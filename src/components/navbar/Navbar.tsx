"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingBasket,
  Menu,
  X,
  Heart,
  CircleUser,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(3); // Demo cart count
  const [wishlistCount, setWishlistCount] = useState(2); // Demo wishlist count

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const session = useSession();
  const user = session?.data?.user as any;
  const userId = user?.id;
  console.log(session);

  const { data: cartData } = useQuery({
    queryKey: ["cart", userId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/cart/cartuser/${userId}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch cart data");
      }

      return res.json();
    },
  });
  console.log("cartData", cartData);

  const { data: wishlist } = useQuery({
    queryKey: ["wishlist", userId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/wishlist/getwishlist/${userId}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch wishlist data");
      }

      return res.json();
    },
  });

  console.log("wishlist", wishlist);

  const totalQuantity = cartData?.data?.reduce(
    (sum: number, item: any) => sum + (item.quantity || 0),
    0
  );

  const totalWishlist = wishlist?.data?.length ?? 0;

  return (
    <nav className="bg-white shadow-xl sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-[50px] w-[50px] flex items-center justify-center">
                <Image
                  src="/images/source.gif"
                  width={200}
                  height={200}
                  className="object-cover"
                  alt="logo image"
                />
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-red-600 group-hover:text-red-700 transition-colors duration-300 tracking-tight">
                Tomato.
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-10 font-semibold tracking-wide">
            {[
              { label: "Home", href: "/" },
              { label: "Products", href: "/products" },
              { label: "About Us", href: "/about-us" },
              { labproductIdel: "Blog & Expert Tips", href: "/blog" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="relative text-gray-700 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-red-50 text-base group"
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className="absolute left-0 bottom-0 h-0.5 w-full bg-red-600 scale-x-0 origin-center transition-transform duration-300 ease-in-out group-hover:scale-x-100"
                />
              </Link>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-5">
            {/* Search */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                className="w-44 lg:w-56 pl-10 pr-4 py-2 text-sm border-gray-200 focus:ring-red-500 focus:border-red-500 rounded-lg transition-all duration-300 hover:border-red-300"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            {/* Wishlist */}
            <Button
              variant="ghost"
              className="relative p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-300"
              asChild
            >
              <Link href="/wishlist">
                <Heart className="!w-8 !h-8" />
                {totalWishlist > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-7 w-7 flex items-center justify-center">
                    {totalWishlist}
                  </span>
                )}
              </Link>
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              className="relative p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-300"
              asChild
            >
              <Link href="/cart">
                <ShoppingBasket className="!w-8 !h-8" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-7 w-7 flex items-center justify-center">
                    {totalQuantity}
                  </span>
                )}
              </Link>
            </Button>

            {session?.status === "authenticated" ? (
              <Button
                variant="ghost"
                className="relative p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-300"
                asChild
              >
                <Link href="/account">
                  <CircleUser className="!w-8 !h-8" />
                </Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-white hover:bg-red-500 transition-all duration-300 rounded-full"
                asChild
              >
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Mobile Wishlist */}
            <Button
              variant="ghost"
              className="relative p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-300"
              asChild
            >
              <Link href="/wishlist">
                <Heart className="!w-8 !h-8" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </Button>

            {/* Mobile Cart */}
            <Button
              variant="ghost"
              className="relative p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-300"
              asChild
            >
              <Link href="/cart">
                <ShoppingBasket className="!w-8 !h-8" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>

            {/* Hamburger Menu */}
            <Button
              variant="ghost"
              onClick={toggleMenu}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-300"
            >
              {isMenuOpen ? (
                <X className="w-7 h-7" />
              ) : (
                <Menu className="w-7 h-7" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4 px-2 animate-[slideDown_0.3s_ease-out]">
            <div className="space-y-2">
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 text-sm border-gray-200 focus:ring-red-500 focus:border-red-500 rounded-lg transition-all duration-300 hover:border-red-300"
                  />
                </div>
              </div>

              {/* Mobile Navigation Links */}
              {[
                "Home",
                "Menu",
                "About Us",
                "Contact Us",
                "Blog & Expert Tips",
              ].map((item) => (
                <Link
                  key={item}
                  href={`/${item
                    .toLowerCase()
                    .replace(/ & /g, "-")
                    .replace(/\s+/g, "-")}`}
                  className="block px-3 py-2 text-base font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}

              {/* Mobile Account Links */}
              <div className="px-3 pt-2 space-y-2">
                <Button
                  variant="outline"
                  className="w-full border-gray-200 text-gray-700 hover:text-red-600 hover:bg-red-50 text-base font-semibold rounded-lg"
                  asChild
                >
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-base font-semibold rounded-lg"
                  asChild
                >
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
