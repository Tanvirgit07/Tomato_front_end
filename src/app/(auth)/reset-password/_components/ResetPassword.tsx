"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff} from "lucide-react";
import Image from "next/image";
// import restePassImage from "@/Public/images/resetPass.svg";

interface PasswordState {
  newPassword: string;
  confirmPassword: string;
}

interface ShowPasswordState {
  newPassword: boolean;
  confirmPassword: boolean;
}

interface ErrorState {
  newPassword?: string;
  confirmPassword?: string;
}

const ResetPassword = () => {
  const [passwords, setPasswords] = useState<PasswordState>({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState<ShowPasswordState>({
    newPassword: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState<ErrorState>({});
  const [isLoading, setIsLoading] = useState(false);


  const handleInputChange = (field: keyof PasswordState, value: string) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const togglePasswordVisibility = (field: keyof ShowPasswordState) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    const newErrors: ErrorState = {};
    if (!passwords.newPassword) newErrors.newPassword = "New password is required";
    else if (passwords.newPassword.length < 8) newErrors.newPassword = "Password must be at least 8 characters";

    if (!passwords.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (passwords.newPassword !== passwords.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Password reset successful", passwords);
    setIsLoading(false);
  };


  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Left - Image */}
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
                         T<span className="text-red-400">O</span>MAT<span className="text-red-400">O</span>
                       </span>
                     </div>
                   </div>
                 </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-start p-6 lg:p-12">
        <div className="w-full max-w-2xl">
          <h2 className="text-[30px] lg:text-[40px] font-semibold text-[#000000] leading-[120%]">
            Reset Password
          </h2>
          <p className="text-[#B0B0B0] text-base mb-8">Create your new password</p>

          {/* New Password */}
          <div className="mb-4">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                placeholder="Enter new password"
                type={showPassword.newPassword ? "text" : "password"}
                value={passwords.newPassword}
                onChange={(e) => handleInputChange("newPassword", e.target.value)}
                className={`pr-10 h-[51px] ${
                  errors.newPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("newPassword")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
              >
                {showPassword.newPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.newPassword && <p className="text-sm text-red-600 mt-1">{errors.newPassword}</p>}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                placeholder="Enter confirm new password"
                type={showPassword.confirmPassword ? "text" : "password"}
                value={passwords.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className={`pr-10 h-[51px] ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
              >
                {showPassword.confirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full h-[51px] text-base bg-[#EF1A26] hover:bg-[#d84a52] text-white font-medium rounded-md transition disabled:opacity-60"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
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
                <span>Updating...</span>
              </div>
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
