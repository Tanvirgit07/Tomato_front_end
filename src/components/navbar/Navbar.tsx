"use client"
import { Search, ShoppingBasket, Menu, X, User } from 'lucide-react'
import React, { useState } from 'react'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(3) // Demo cart count

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-red-600 cursor-pointer hover:text-red-700 transition-colors">
              Tomato.
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors">
              Home
            </a>
            <a href="#" className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors">
              Menu
            </a>
            <a href="#" className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors">
              About Us
            </a>
            <a href="#" className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors">
              Contact Us
            </a>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                <Search size={20} />
              </button>
            </div>
            
            {/* Cart */}
            <div className="relative">
              <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                <ShoppingBasket size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Login */}
            <button className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
              <User size={16} />
              <span className="text-sm font-medium">Login</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Mobile Cart */}
            <div className="relative">
              <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                <ShoppingBasket size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
            
            {/* Hamburger Menu */}
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              
              {/* Mobile Navigation Links */}
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                Home
              </a>
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                Menu
              </a>
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                About Us
              </a>
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                Contact Us
              </a>
              
              {/* Mobile Login Button */}
              <div className="px-3 pt-4">
                <button className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors">
                  <User size={16} />
                  <span className="font-medium">Login</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar