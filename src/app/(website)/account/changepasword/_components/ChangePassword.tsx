/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, Shield } from "lucide-react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePassword() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const session = useSession();
  const user = session?.data?.user as any;
  const token = user?.accessToken;

  const [formData, setFormData] = useState<ChangePasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (bodyData: {
      oldPassword: string;
      newPassword: string;
    }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/changepass`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bodyData),
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to change password");
      }

      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data.message || "Password changed successfully!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to change password");
    },
  });

  const handleInputChange = (
    field: keyof ChangePasswordForm,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    if (!formData.currentPassword || !formData.newPassword) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    changePasswordMutation.mutate({
      oldPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Card Container */}
        <div className="bg-white border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-2 py-10 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Shield className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">Change Your Password</h1>
            <p className="text-blue-100 text-base max-w-md mx-auto">
              Keep your account secure with a strong, unique password.
            </p>
          </div>

          {/* Form Body */}
          <div className="p-3 sm:p-10 space-y-8">
            {/* Password Requirements */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-sm text-blue-800">
              <p className="font-semibold mb-2">Your new password must include:</p>
              <ul className="space-y-1 text-blue-700">
                <li>• At least 8 characters</li>
                <li>• One uppercase & one lowercase letter</li>
                <li>• At least one number</li>
                <li>• At least one special character (!@#$%^&* etc.)</li>
              </ul>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-base font-semibold text-gray-800">
                  Current Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    value={formData.currentPassword}
                    onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                    className="pl-12 pr-12 h-14 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-base font-semibold text-gray-800">
                  New Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Create new password"
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange("newPassword", e.target.value)}
                    className="pl-12 pr-12 h-14 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-base font-semibold text-gray-800">
                  Confirm New Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="pl-12 pr-12 h-14 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-4 pt-4">
              <Button
                onClick={handleSubmit}
                disabled={changePasswordMutation.isPending}
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {changePasswordMutation.isPending ? "Changing Password..." : "Change Password"}
              </Button>

              <Link href="/profile" className="block">
                <Button
                  variant="outline"
                  className="w-full h-14 border-2 border-gray-300 hover:border-gray-400 text-gray-800 font-semibold text-lg rounded-2xl hover:bg-gray-50 transition"
                >
                  Back to Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}