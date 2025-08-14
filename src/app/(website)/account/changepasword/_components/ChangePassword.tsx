"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function ChangePassword() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Change Password submitted:", formData);
    // Add your password change logic here
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white">
  {/* Header Icon */}
  <div className="flex justify-center mb-6">
    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
      <Lock className="w-6 h-6 text-blue-600" />
    </div>
  </div>

  {/* Title */}
  <h1 className="text-2xl font-semibold text-gray-900 text-center mb-4">
    Change Password
  </h1>

  {/* Description */}
  <div className="text-sm text-gray-600 mb-8 leading-relaxed text-center">
    <p className="mb-2">
      To change your password, please fill in the fields below.
    </p>
    <p>
      Your password must contain at least 8 characters, and also include at
      least one uppercase letter, one lowercase letter, one number, and one
      special character.
    </p>
  </div>

  {/* Form Fields */}
  <div className="space-y-6">
    {/* Current Password */}
    <div className="space-y-2">
      <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-900">
        Current Password
      </Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          id="currentPassword"
          type={showCurrentPassword ? "text" : "password"}
          placeholder="Current Password"
          value={formData.currentPassword}
          onChange={(e) => handleInputChange("currentPassword", e.target.value)}
          className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>

    {/* New Password */}
    <div className="space-y-2">
      <Label htmlFor="newPassword" className="text-sm font-medium text-gray-900">
        New Password
      </Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          id="newPassword"
          type={showNewPassword ? "text" : "password"}
          placeholder="New Password"
          value={formData.newPassword}
          onChange={(e) => handleInputChange("newPassword", e.target.value)}
          className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={() => setShowNewPassword(!showNewPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>

    {/* Confirm Password */}
    <div className="space-y-2">
      <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-900">
        Confirm Password
      </Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          id="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
          className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  </div>

  {/* Submit Button */}
  <div className="mt-8 space-y-4">
    <Button
      onClick={handleSubmit}
      className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
    >
      Change Password
    </Button>

    <Link href="/profile">
      <Button className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg">
        Go to Profile
      </Button>
    </Link>
  </div>
</div>

  );
}
