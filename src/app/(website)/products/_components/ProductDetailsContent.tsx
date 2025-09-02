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
  // Create dynamic content sections based on API data and placeholders
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
      <div className="mb-8">
        <h1 className="lg:text-[32px] md:text-[28px] text-[20px] font-semibold leading-[120%] mb-4">
          What will you get?
        </h1>
        
        {/* Content Sections */}
        <div className="space-y-8">
          {contentSections.map((section, index) => (
            <div key={index} className="space-y-4">
              {/* Section Title */}
              {section.title && (
                <h2 className="text-lg font-semibold text-gray-900">
                  {section.title}
                </h2>
              )}
              
              {/* Section Paragraph */}
              {section.paragraph && (
                <p className="text-gray-700 leading-relaxed text-justify">
                  {section.paragraph}
                </p>
              )}
              
              {/* Bullet Points */}
              {section.bulletPoints && (
                <ul className="space-y-2 ml-4">
                  {section.bulletPoints.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 leading-relaxed">
                        {point.text}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsContent