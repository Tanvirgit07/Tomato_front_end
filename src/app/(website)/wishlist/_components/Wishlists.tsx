"use client"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Trash2, 
  Eye, 
  Share2,
  Tag,
  TrendingUp,
  Package,
  Zap,
  Grid,
  List
} from 'lucide-react';

export default function Wishlists() {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: "Premium Wireless Headphones",
      brand: "AudioTech Pro",
      price: 299.99,
      originalPrice: 399.99,
      image: "/api/placeholder/300/300",
      rating: 4.8,
      reviews: 1247,
      inStock: true,
      discount: 25,
      category: "Electronics",
      isNew: false,
      isTrending: true
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      brand: "FitTrack",
      price: 199.99,
      originalPrice: 249.99,
      image: "/api/placeholder/300/300",
      rating: 4.6,
      reviews: 892,
      inStock: true,
      discount: 20,
      category: "Wearables",
      isNew: true,
      isTrending: false
    },
    {
      id: 3,
      name: "Professional Camera Lens",
      brand: "LensMaster",
      price: 599.99,
      originalPrice: 799.99,
      image: "/api/placeholder/300/300",
      rating: 4.9,
      reviews: 456,
      inStock: false,
      discount: 25,
      category: "Photography",
      isNew: false,
      isTrending: true
    },
    {
      id: 4,
      name: "Ergonomic Office Chair",
      brand: "ComfortDesk",
      price: 449.99,
      originalPrice: 549.99,
      image: "/api/placeholder/300/300",
      rating: 4.7,
      reviews: 634,
      inStock: true,
      discount: 18,
      category: "Furniture",
      isNew: false,
      isTrending: false
    },
    {
      id: 5,
      name: "Wireless Gaming Mouse",
      brand: "GamePro",
      price: 89.99,
      originalPrice: 119.99,
      image: "/api/placeholder/300/300",
      rating: 4.5,
      reviews: 1089,
      inStock: true,
      discount: 25,
      category: "Gaming",
      isNew: true,
      isTrending: true
    },
    {
      id: 6,
      name: "Premium Coffee Machine",
      brand: "BrewMaster",
      price: 399.99,
      originalPrice: 499.99,
      image: "/api/placeholder/300/300",
      rating: 4.8,
      reviews: 723,
      inStock: true,
      discount: 20,
      category: "Appliances",
      isNew: false,
      isTrending: false
    }
  ]);

  const [viewMode, setViewMode] = useState('grid'); // State to toggle between grid and list view

  const removeFromWishlist = (itemId:number) => {
    setWishlistItems(items => items.filter(item => item.id !== itemId));
  };

  const addToCart = (item:any) => {
    console.log('Adding to cart:', item);
    // Add your cart logic here
  };

  const shareItem = (item: any) => {
    console.log('Sharing item:', item);
    // Add share functionality here
  };

  const viewDetails = (item:any) => {
    console.log('View details:', item);
    // Add navigation to product details
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full shadow-lg">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">My Wishlist</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Save your favorite items and never miss out on the products you love
          </p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <Badge variant="secondary" className="px-4 py-2 text-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              {wishlistItems.length} Items Saved
            </Badge>
            {/* View Toggle Buttons */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                className="px-3 py-1"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4 mr-1" />
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                className="px-3 py-1"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4 mr-1" />
                List
              </Button>
            </div>
          </div>
        </div>

        {/* Wishlist Items */}
        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500">Start adding items you love to keep track of them</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
            : 'flex flex-col gap-6'}>
            {wishlistItems.map((item) => (
              <Card 
                key={item.id} 
                className={`group bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden 
                  ${viewMode === 'list' ? 'flex flex-row items-center p-4' : ''}`}
              >
                <div className={viewMode === 'list' ? 'w-1/3 relative' : 'relative'}>
                  {/* Product Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className={`object-cover group-hover:scale-110 transition-transform duration-500 
                        ${viewMode === 'grid' ? 'w-full h-64' : 'w-full h-40'}`}
                    />
                    
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-white/90 hover:bg-white text-gray-800"
                          onClick={() => viewDetails(item)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-white/90 hover:bg-white text-gray-800"
                          onClick={() => shareItem(item)}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {item.discount > 0 && (
                        <Badge className="bg-red-500 text-white font-semibold">
                          -{item.discount}%
                        </Badge>
                      )}
                      {item.isNew && (
                        <Badge className="bg-green-500 text-white font-semibold">
                          <Zap className="h-3 w-3 mr-1" />
                          NEW
                        </Badge>
                      )}
                      {item.isTrending && (
                        <Badge className="bg-orange-500 text-white font-semibold">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          HOT
                        </Badge>
                      )}
                    </div>

                    {/* Remove Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-3 right-3 h-8 w-8 p-0 bg-white/80 hover:bg-red-50 text-gray-600 hover:text-red-500 rounded-full"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <CardContent className={viewMode === 'list' ? 'w-2/3 p-4' : 'p-6'}>
                  {/* Brand & Category */}
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs bg-gray-50">
                      <Tag className="h-3 w-3 mr-1" />
                      {item.category}
                    </Badge>
                    <span className="text-xs text-gray-500 font-medium">{item.brand}</span>
                  </div>

                  {/* Product Name */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {item.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(item.rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {item.rating} ({item.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-gray-900">
                      ${item.price}
                    </span>
                    {item.originalPrice > item.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ${item.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="mb-4">
                    {item.inStock ? (
                      <div className="flex items-center text-green-600 text-sm">
                        <Package className="h-4 w-4 mr-1" />
                        In Stock
                      </div>
                    ) : (
                      <div className="flex items-center text-red-500 text-sm">
                        <Package className="h-4 w-4 mr-1" />
                        Out of Stock
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      className={`flex-1 h-11 font-semibold transition-all duration-300 ${
                        item.inStock
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={!item.inStock}
                      onClick={() => addToCart(item)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Action Bar */}
        {wishlistItems.length > 0 && (
          <div className="mt-12 text-center">
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                  onClick={() => console.log('Add all to cart')}
                >
                  Add All to Cart
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => setWishlistItems([])}
                >
                  Clear Wishlist
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}