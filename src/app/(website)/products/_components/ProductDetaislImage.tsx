"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

interface SubImage {
  url: string;
  publicId: string;
  _id: string;
}

interface ProductData {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  image: string;
  subImages: SubImage[];
  category: {
    _id: string;
    name: string;
  };
  subCategory: {
    _id: string;
    name: string;
  };
}

interface ProductDetailsImageProps {
  productId: string | string[];
  productData: ProductData;
}

const ProductDetailsImage: React.FC<ProductDetailsImageProps> = ({
  productId,
  productData,
}) => {
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>("");

  // Construct the images array using API data
  const displayData = {
    id: Array.isArray(productId) ? productId[0] : productId,
    title: productData.name || "Unnamed Product",
    price: productData.discountPrice || productData.price || 0,
    originalPrice: productData.price,
    images: [
      {
        id: 0,
        src: productData.image,
        alt: `${productData.name} - Main View`,
      },
      ...productData.subImages.map((img, index) => ({
        id: index + 1,
        src: img.url,
        alt: `${productData.name} - View ${index + 1}`,
      })),
    ],
    features: [
      `Category: ${productData.category?.name || "General"}`,
      `Sub-Category: ${productData.subCategory?.name || "Standard"}`,
    ],
  };

  const handleAddToCart = () => {
    try {
      const cartItem = {
        id: displayData.id,
        title: displayData.title,
        size: selectedSize || "Not selected",
        price: displayData.price,
        image: displayData.images[selectedImage].src,
        quantity: 1,
      };

      // Retrieve existing cart items from localStorage
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
      // Check if the product with the same id and size exists
      const existingItemIndex = existingCart.findIndex(
        (item: typeof cartItem) =>
          item.id === cartItem.id && item.size === cartItem.size
      );

      let updatedCart;
      if (existingItemIndex !== -1) {
        // Increment quantity if item exists
        updatedCart = [...existingCart];
        updatedCart[existingItemIndex].quantity += 1;
      } else {
        // Add new item to cart
        updatedCart = [...existingCart, cartItem];
      }

      // Save updated cart to localStorage
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      console.log("Updated cart:", updatedCart);

      // Trigger storage event to update Navbar
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-white lg:mt-[83px] md:mt-[60px] mt-[40px] lg:mb-[40px] md:mb-[30px] mb-[20px]">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 sm:gap-8 lg:gap-[100px]">
        {/* Image Gallery Section */}
        <div className="flex flex-col gap-3 sm:gap-4 w-full sm:max-w-[600px]">
          {/* Main Image */}
          <div className="w-full">
            <Card className="overflow-hidden w-full h-full">
              <CardContent className="p-0">
                <Image
                  width={400}
                  height={400}
                  src={displayData.images[selectedImage].src}
                  alt={displayData.images[selectedImage].alt}
                  className="w-full h-[200px] sm:h-[300px] object-cover"
                />
              </CardContent>
            </Card>
          </div>

          {/* Thumbnail Row */}
          <div className="flex flex-row gap-[20px] overflow-x-auto">
            {displayData.images.map((image) => (
              <Card
                key={image.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md flex-shrink-0 ${
                  selectedImage === image.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setSelectedImage(image.id)}
              >
                <CardContent className="p-0">
                  <Image
                    width={300}
                    height={300}
                    src={image.src}
                    alt={image.alt}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="space-y-4 sm:space-y-6 flex-1 w-full">
          {/* Product Title */}
          <div>
            <h1 className="text-[18px] sm:text-[22px] md:text-[30px] lg:text-[40px] font-semibold text-[#212121] leading-[120%]">
              {displayData.title}
            </h1>
            <div
              className="text-[16px] sm:text-[20px] leading-[150%] font-normal text-[#4E4E4E] mt-2 sm:mt-3"
              dangerouslySetInnerHTML={{
                __html: productData.description || "No description available.",
              }}
            />
          </div>

          {/* Product Features */}
          <div className="space-y-2">
            {displayData.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-[16px] sm:text-[20px] leading-[150%] font-normal text-[#4E4E4E]">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Size Selection */}
          <div className="space-y-2 flex items-center gap-4 sm:gap-6">
            <label className="text-xl sm:text-2xl text-[#4E4E4E] font-semibold mt-2">
              Size:
            </label>
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-36 sm:w-40">
                <SelectValue placeholder="Medium" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xs">Extra Small</SelectItem>
                <SelectItem value="s">Small</SelectItem>
                <SelectItem value="m">Medium</SelectItem>
                <SelectItem value="l">Large</SelectItem>
                <SelectItem value="xl">Extra Large</SelectItem>
                <SelectItem value="xxl">XXL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price */}
          <div className="py-3 sm:py-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-4xl font-bold text-gray-900">
                ${displayData.price}
              </span>
              {displayData.originalPrice &&
                displayData.originalPrice !== displayData.price && (
                  <span className="text-lg sm:text-xl text-gray-500 line-through">
                    ${displayData.originalPrice}
                  </span>
                )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Link
              href={`/customize-product/panel/${displayData.id}`}
              className="flex-1 w-full"
            >
              <Button
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200"
                size="lg"
              >
                Customize
              </Button>
            </Link>
            <Button
              className="flex-1 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
              size="lg"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsImage;
