"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import OtpImage from "@/Public/images/otpImage.svg";

const OTPForm: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) return;

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("OTP Verified:", otpString);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="relative w-full h-full">
          <Image
            src="/images/signupImage.jpg"
            alt="Sign Up Illustration"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
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
        </div>
      </div>

      {/* Right Side - OTP Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-start px-6 py-12">
        <div className="w-full max-w-xl">
          <div className=" p-8">
            {/* Header */}
            <div className="text-start mb-8">
              <h1 className="lg:text-[40px] md:text-[30px] text-[20px] font-semibold leading-[120%] text-[#000000]">
                Enter OTP
              </h1>
              <p className="text-[#B0B0B0] text-base leading-[120%] font-normal mb-8">
                We have sent a code to your registered email address
                <br />
                robert.fox@example.com
              </p>
            </div>

            {/* OTP Inputs */}
            <div className="flex justify-between mb-8">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]"
                  maxLength={1}
                  value={digit}
                  onChange={(e) =>
                    handleInputChange(index, e.target.value.replace(/\D/g, ""))
                  }
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-14 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
                />
              ))}
            </div>

            {/* Verify Button */}
            <Button
              onClick={handleVerify}
              className="bg-[#EF1A26] hover:bg-[#d46368] text-base text-white w-full h-[51px]"
            >
              Verify
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPForm;
