import React from "react";
import { Star, Truck, Users, TrendingUp, Clock } from "lucide-react";

const BoyBenefits = () => {
  const benefits = [
    {
      icon: <Star className="w-8 h-8 text-white" />,
      iconBg: "bg-purple-500",
      title: "0% Commission",
      description: "0% Platform commission fee for 30 Days",
    },
    {
      icon: <div className="text-white font-bold text-sm">FREE</div>,
      iconBg: "bg-green-500",
      title: "Free Shipping",
      description: "Offer Free Shipping via programs like FSM",
    },
    {
      icon: <Truck className="w-8 h-8 text-white" />,
      iconBg: "bg-orange-500",
      title: "Nationwide Reach",
      description: "Deliver your product anywhere in the country",
    },
    {
      icon: <Users className="w-8 h-8 text-white" />,
      iconBg: "bg-blue-600",
      title: "Dedicated Support & Training",
      description: "Incubation specialist support for 90 days",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-white" />,
      iconBg: "bg-orange-500",
      title: "Marketing Tools",
      description:
        "Create Product Ads to increase visibility in search results",
    },
    {
      icon: <Clock className="w-8 h-8 text-white" />,
      iconBg: "bg-blue-600",
      title: "Timely Payments",
      description: "Weekly payment cycles",
    },
  ];

  return (
    <div className="bg-gray-50 py-16 px-4">
      <div className="container mx-auto">
        {/* Title */}
        <div>
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
            New Seller Benefits
          </h2>
          <p className="text-lg text-center text-gray-600 max-w-2xl mx-auto mb-16">
            Unlock exclusive perks designed to help you grow faster. From
            increased visibility to reliable support, we make sure your journey
            as a seller is smooth and rewarding.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center space-y-4"
            >
              {/* Icon */}
              <div
                className={`w-16 h-16 ${benefit.iconBg} rounded-full flex items-center justify-center shadow-lg`}
              >
                {benefit.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-800">
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoyBenefits;
