"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Lock,
  Camera,
  Edit3,
  Mail,
  Settings,
  Shield,
  ChevronRight,
  Crown,
  Verified,
} from "lucide-react";
import Link from "next/link";

export default function Profilepage() {
  const [isHovering, setIsHovering] = useState(false);
  const [user] = useState({
    name: "Alexa Rawles",
    email: "alexarawles@gmail.com",
    avatar: "/api/placeholder/120/120",
    isPremium: true,
    isVerified: true,
    joinDate: "January 2024",
  });

  const handlePersonalInfo = () => {
    console.log("Navigate to Personal Information");
    // Add navigation logic here
  };

  const handleChangePassword = () => {
    console.log("Navigate to Change Password");
    // Add navigation logic here
  };

  const handleImageUpload = () => {
    console.log("Upload new profile image");
    // Add image upload logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600 text-lg">
            Manage your profile and account settings
          </p>
        </div>

        {/* Main Profile Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                ></div>
              </div>

              {/* Profile Content */}
              <div className="relative z-10 text-center py-8">
                {/* Avatar Section */}
                <div className="relative inline-block">
                  <div
                    className="relative group cursor-pointer"
                    onClick={handleImageUpload}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <Avatar className="h-32 w-32 border-4 border-white shadow-xl ring-4 ring-white/50 transition-transform duration-300 group-hover:scale-105">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-3xl font-bold">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    {/* Camera Overlay */}
                    <div
                      className={`absolute inset-0 bg-black/50 rounded-full flex items-center justify-center transition-opacity duration-300 ${
                        isHovering ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <Camera className="h-8 w-8 text-white" />
                    </div>

                    {/* Edit Button */}
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-white text-gray-700 hover:bg-gray-100 shadow-lg border-2 border-white"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* User Info */}
                <div className="mt-6 text-white">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    {user.isVerified && (
                      <Verified className="h-6 w-6 text-blue-300" />
                    )}
                    {user.isPremium && (
                      <Crown className="h-6 w-6 text-yellow-300" />
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Mail className="h-4 w-4 text-gray-300" />
                    <p className="text-gray-200">{user.email}</p>
                  </div>

                  <div className="flex justify-center gap-2">
                    {user.isPremium && (
                      <Badge className="bg-yellow-500/20 text-yellow-200 border-yellow-500/30">
                        Premium Member
                      </Badge>
                    )}
                    <Badge className="bg-blue-500/20 text-blue-200 border-blue-500/30">
                      Member since {user.joinDate}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              {/* Action Buttons */}
              <div className="space-y-4">
                <div className="">
                  <Link href="/account/personalInfo">
                    <Button
                      onClick={handlePersonalInfo}
                      className="w-full h-16 cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                      size="lg"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-white/20 rounded-lg">
                            <User className="h-6 w-6" />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-lg">
                              Personal Information
                            </p>
                            <p className="text-sm text-blue-100">
                              Update your profile details
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-6 w-6 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </Button>
                  </Link>
                </div>

                <div>
                  <Link href="/account/changepasword">
                    <Button
                      onClick={handleChangePassword}
                      className="w-full h-16 cursor-pointer bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                      size="lg"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-white/20 rounded-lg">
                            <Lock className="h-6 w-6" />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-lg">
                              Change Password
                            </p>
                            <p className="text-sm text-purple-100">
                              Update your security settings
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-6 w-6 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Footer Note */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  <Shield className="h-4 w-4 inline mr-2" />
                  Your account is secured with industry-standard encryption
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
