import React from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

const StepToStepSelling = () => {
  const steps = [
    {
      id: 1,
      title: "Sign up with a phone number",
      content:
        "Create your seller account by providing your phone number for verification. This is the first step to join our platform.",
    },
    {
      id: 2,
      title: "Fill in contact email & address details",
      content:
        "Complete your profile with accurate contact information including your email address and business address details.",
    },
    {
      id: 3,
      title: "Submit ID and Bank Account details",
      content:
        "Provide your identification documents and bank account information for verification and payment processing.",
    },
    {
      id: 4,
      title: "Upload products and get orders!",
      content:
        "Start adding your products to the platform with descriptions, images, and pricing to begin receiving orders from customers.",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-pink-50 to-orange-50 py-20 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Side - Content */}
          <div className="space-y-8">
            {/* Title */}
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800">
              Steps to Start Selling
            </h2>

            {/* Sub Description */}
            <p className="text-gray-600 text-lg leading-relaxed">
              Sign up now to be a{" "}
              <span className="font-semibold text-orange-600">Tomato Seller</span>!  
              Gain access to tools, support, and a wide customer base to grow
              your business faster and smarter.
            </p>

            {/* Sign up Button */}
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 text-white px-10 py-4 text-lg font-semibold rounded-full shadow-lg">
              Sign up now
            </Button>
          </div>

          {/* Right Side - Steps (FAQ style) */}
          <div className="space-y-4">
            {steps.map((step) => (
              <Collapsible
                key={step.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-100 transition-all"
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full px-6 py-5 text-left">
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-bold text-white bg-orange-500 w-8 h-8 flex items-center justify-center rounded-full">
                      {step.id}
                    </span>
                    <span className="text-lg font-semibold text-gray-800">
                      {step.title}
                    </span>
                  </div>
                  <ChevronDown className="h-5 w-5 text-gray-500 transition-transform duration-200 data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent className="px-6 pb-5">
                  <p className="text-gray-600 leading-relaxed">
                    {step.content}
                  </p>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepToStepSelling;
