"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBasket, Menu, X, User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(3); // Demo cart count
  const [wishlistCount, setWishlistCount] = useState(2); // Demo wishlist count

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-xl sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <svg
                className="w-9 h-9 text-red-600 group-hover:text-red-700 transition-colors duration-300"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4-8h-3v3c0 .55-.45 1-1 1s-1-.45-1-1v-3H8c-.55 0-1-.45-1-1s.45-1 1-1h3V7c0-.55.45-1 1-1s1 .45 1 1v3h3c.55 0 1 .45 1 1s-.45 1-1 1z" />
              </svg>
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
              { label: "Blog & Expert Tips", href: "/blog" },
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
                <Heart className="w-6 h-6" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount}
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
                <ShoppingBasket className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>

            {/* Account Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-300"
                >
                  <User className="w-7 h-7" />
                  <span className="sr-only">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-white border border-gray-200 rounded-lg shadow-xl p-2"
              >
                <DropdownMenuItem asChild>
                  <Link
                    href="/login"
                    className="w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors duration-200"
                  >
                    Login
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/signup"
                    className="w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors duration-200"
                  >
                    Sign Up
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                <Heart className="w-6 h-6" />
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
                <ShoppingBasket className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>

            {/* Mobile Account */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-300"
                >
                  <User className="w-7 h-7" />
                  <span className="sr-only">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-white border border-gray-200 rounded-lg shadow-xl p-2"
              >
                <DropdownMenuItem asChild>
                  <Link
                    href="/login"
                    className="w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors duration-200"
                  >
                    Login
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/signup"
                    className="w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors duration-200"
                  >
                    Sign Up
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
