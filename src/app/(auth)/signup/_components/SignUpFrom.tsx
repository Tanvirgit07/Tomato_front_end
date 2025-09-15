"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react"; // 👈 eye icon যোগ করা হলো

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  termsAndCondition: boolean;
}

const SignUpFrom: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    termsAndCondition: false,
  });

  const [showPassword, setShowPassword] = useState(false); // 👈 Password toggle state
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const createUserMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (body: any) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create user");
      }

      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      router.push("/login");
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, termsAndCondition: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    createUserMutation.mutate(formData);
  };

  return (
    <div className="h-screen mt-16 flex flex-col lg:flex-row">
      {/* Left - Image */}
      <div className="w-full lg:w-1/2 h-64 lg:h-auto relative">
        <Image
          src="/images/signupImage.jpg"
          alt="Sign Up Illustration"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute top-16 left-8 z-10">
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

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 bg-gray-50 flex items-center justify-start p-6 sm:p-10">
        <div className="w-full max-w-2xl">
          <h2 className="lg:text-[40px] md:text-[30px] text-[20px] font-semibold leading-[120%] text-[#000000]">
            Create New Account
          </h2>
          <p className="text-[#B0B0B0] text-base leading-[120%] font-normal mb-8">
            Please enter your details
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name" className="text-base font-medium leading-[120%]">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                className="h-[51px] border border-[#272727] mt-2"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-base font-medium leading-[120%]">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="h-[51px] border border-[#272727] mt-2"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-base font-medium leading-[120%]">
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="h-[51px] border border-[#272727] mt-2"
                required
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-base font-medium leading-[120%]">
                Password
              </Label>
              <div className="relative mt-2">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="h-[51px] border border-[#272727] pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword" className="text-base font-medium leading-[120%]">
                Confirm Password
              </Label>
              <div className="relative mt-2">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="h-[51px] border border-[#272727] pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="termsAndCondition"
                checked={formData.termsAndCondition}
                onCheckedChange={handleCheckboxChange}
                className="w-5 h-5 rounded-sm border-gray-300 text-red-600 focus:ring-red-500"
              />
              <Label htmlFor="termsAndCondition" className="text-sm text-gray-700">
                I agree to the Terms & Conditions
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full !h-[51px] text-base bg-[#EF1A26] hover:bg-[#db4f56]"
            >
              Signup
            </Button>
            <p className="text-xs text-gray-500 mt-1 text-center">
              Do you have an account?{" "}
              <Link href="/login" className="text-red-600 hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpFrom;
