'use client'

import React from 'react'

interface ProductData {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  image: string;
  category: {
    _id: string;
    name: string;
  };
  subCategory: {
    _id: string;
    name: string;
  };
}

interface BulletPoint {
  text: string
}

interface ContentSection {
  title?: string
  paragraph?: string
  bulletPoints?: BulletPoint[]
}

interface ProductDetailsContentProps {
  productData: ProductData;
}

const ProductDetailsContent: React.FC<ProductDetailsContentProps> = ({ productData }) => {
  const contentSections: ContentSection[] = [
    {
      paragraph: productData.description ? 
        productData.description.replace(/<[^>]*>/g, '') : // Strip HTML tags
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi quis dolor urna. Sed sed felis dui. Suspendisse nec ligula vel nulla ullamcorper volutpat. Integer luctus facilisis nunc, sit amet mattis odio vestibulum sit amet. Vestibulum sed egestas augue. Nullam ac cursus felis. Vivamus mattis quam ut leo finibus finibus."
    },
    {
      title: "Product Features",
      bulletPoints: [
        { text: `Product Name: ${productData.name}` },
        { text: `Category: ${productData.category?.name || 'General'}` },
        { text: `Sub-Category: ${productData.subCategory?.name || 'Standard'}` },
        { text: `Regular Price: $${productData.price}` },
        { text: `Discount Price: $${productData.discountPrice}` },
        { text: "Premium Quality Materials" }, // Placeholder
        { text: "Expertly Crafted Design" }, // Placeholder
        { text: "Satisfaction Guaranteed" } // Placeholder
      ]
    },
    {
      title: "Why Choose This Product?",
      paragraph: `Experience the perfect blend of quality and value with ${productData.name}. This exceptional product from our ${productData.category?.name || 'premium'} collection offers outstanding features that make it a must-have addition to your collection. Crafted with attention to detail and designed for modern lifestyles.`
    },
    {
      title: "Product Specifications",
      paragraph: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi quis dolor urna. Sed sed felis dui. Suspendisse nec ligula vel nulla ullamcorper volutpat. Integer luctus facilisis nunc, sit amet mattis odio vestibulum sit amet.",
      bulletPoints: [
        { text: "High-quality construction materials" },
        { text: "Durable and long-lasting design" },
        { text: "Easy to maintain and care for" },
        { text: "Available in multiple sizes" },
        { text: "Environmentally conscious packaging" },
        { text: "Backed by manufacturer warranty" },
        { text: "Fast and reliable shipping" },
        { text: "Customer support included" }
      ]
    }
  ]

  return (
    <div className="container mx-auto py-6 bg-white px-4 lg:px-0 md:px-0">
      {/* Main Heading */}
     <div dangerouslySetInnerHTML={{__html: productData.description}}/>
    </div>
  )
}

export default ProductDetailsContent