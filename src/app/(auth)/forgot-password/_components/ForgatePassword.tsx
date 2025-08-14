"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import Image from "next/image";
// import ForgetImage from "@/Public/images/frogetPass.svg";

const ForgatePassword = () => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (): Promise<void> => {
    if (!email) {
      setError("Email address is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    console.log("Password reset email sent to:", email);
  };

  const handleInputChange = (value: string): void => {
    setEmail(value);
    if (error) setError("");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Left Side - Image */}
      <div className="w-full lg:w-1/2 h-64 lg:h-auto relative">
        <Image
          src="/images/signupImage.jpg"
          alt="Sign Up Illustration"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute top-8 left-8 z-10">
          <div className="flex items-center space-x-2">
            <div className="h-[70px] w-[70px] flex items-center justify-center">
              <Image
                src="/images/source.gif"
                width={200}
                height={200}
                className="object-cover"
                alt="logo image"
              />
            </div>
            <span className="text-2xl font-bold text-white">
              T<span className="text-red-400">O</span>MAT
              <span className="text-red-400">O</span>
            </span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-start p-8">
        <div className="w-full max-w-2xl">
          <div className="">
            <div className="mb-8">
              <h1 className="lg:text-[40px] md:text-[30px] text-[20px] font-semibold leading-[120%] text-[#000000]">
                Forgot Password
              </h1>
              <p className="text-[#B0B0B0] text-base leading-[120%] font-normal mb-8">
                Enter your registered email address. We&apos;ll send you a link
                to reset your <br /> password.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-base font-medium leading-[120%]"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder="Enter your email address"
                    className="h-[51px] pl-10 border border-[#272727] mt-2"
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full h-[51px] text-base bg-[#EF1A26] hover:bg-[#d84a52] text-white font-medium rounded-md transition disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="opacity-25"
                      />
                      <path
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
                        5.291A7.962 7.962 0 014 12H0c0 
                        3.042 1.135 5.824 3 7.938l3-2.647z"
                        className="opacity-75"
                      />
                    </svg>
                    <span>Sending...</span>
                  </div>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgatePassword;
