/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Lock, Camera, Edit3, Mail, ChevronRight, Truck } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Profilepage() {
  const [isHovering, setIsHovering] = useState(false);
  const session = useSession();
  const user = session?.data?.user as any; // user info from API

  const handlePersonalInfo = () => {
    console.log("Navigate to Personal Information");
  };

  const handleChangePassword = () => {
    console.log("Navigate to Change Password");
  };

  const handleImageUpload = () => {
    console.log("Upload new profile image");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4">
        {/* Main Profile Card */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="relative overflow-hidden">
              {/* Background */}
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
                {/* Avatar */}
                <div className="relative inline-block">
                  <div
                    className="relative group cursor-pointer"
                    onClick={handleImageUpload}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <Avatar className="h-32 w-32 border-4 border-white shadow-xl ring-4 ring-white/50 transition-transform duration-300 group-hover:scale-105">
                      <AvatarImage src={user?.avatar || ""} alt={user?.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-3xl font-bold">
                        {user?.name
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div
                      className={`absolute inset-0 bg-black/50 rounded-full flex items-center justify-center transition-opacity duration-300 ${
                        isHovering ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <Camera className="h-8 w-8 text-white" />
                    </div>

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
                  <h2 className="text-2xl font-bold mb-2">{user?.name}</h2>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-gray-300" />
                    <p className="text-gray-200">
                      {user?.email} ({user?.role})
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="">
              {/* Action Buttons */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  {/* Register Button */}
                  <div className="flex-1">
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
                          </div>
                        </div>
                        <ChevronRight className="h-6 w-6 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </Button>
                  </Link>
                  </div>

                  {/* Logout Button */}
                  <div className="flex-1">
                    <Link href="/orders">
                    <Button
                      onClick={handlePersonalInfo}
                      className="w-full h-16 cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                      size="lg"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-white/20 rounded-lg">
                            <Truck className="h-6 w-6" />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-lg">
                              My Orders
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-6 w-6 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </Button>
                  </Link>
                  </div>
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
                          </div>
                        </div>
                        <ChevronRight className="h-6 w-6 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </Button>
                  </Link>
                </div>

                {/* New Buttons */}
                <div>
                  <Link href="/login">
                    <Button
                      className="w-full h-16 cursor-pointer bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                      size="lg"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-white/20 rounded-lg">
                            <User className="h-6 w-6" />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-lg">Login</p>
                          </div>
                        </div>
                        <ChevronRight className="h-6 w-6 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </Button>
                  </Link>
                </div>

                <div className="flex gap-4">
                  {/* Register Button */}
                  <div className="flex-1">
                    <Link href="/register">
                      <Button
                        className="w-full h-16 cursor-pointer bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                        size="lg"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-white/20 rounded-lg">
                              <User className="h-6 w-6" />
                            </div>
                            <div className="text-left">
                              <p className="font-semibold text-lg">Register</p>
                            </div>
                          </div>
                          <ChevronRight className="h-6 w-6 transform group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </Button>
                    </Link>
                  </div>

                  {/* Logout Button */}
                  <div className="flex-1">
                    <Button
                      onClick={() => signOut()}
                      className="w-full h-16 cursor-pointer bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                      size="lg"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-white/20 rounded-lg">
                            <Lock className="h-6 w-6" />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-lg">Logout</p>
                          </div>
                        </div>
                        <ChevronRight className="h-6 w-6 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
