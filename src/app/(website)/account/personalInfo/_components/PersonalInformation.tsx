/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { UserCircleIcon, CameraIcon } from "lucide-react";
import Image from "next/image";

// Zod schema
const personalInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50).trim(),
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits").trim(),
  profileImageFile: z
    .any()
    .optional()
    .refine((file) => !file || (file instanceof File && file.type.startsWith("image/")), "Must be an image file")
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, "Max file size is 5MB"),
  bio: z.string().max(200, "Bio must be at most 200 characters").optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    zip: z.string().optional(),
  }),
});

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

interface User {
  _id: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  bio?: string;
  profileImage?: string;
  address?: {
    street?: string;
    city?: string;
    country?: string;
    zip?: string;
  };
}

interface ApiResponse {
  message: string;
  user: User;
}

const PersonalInformation: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const user = session?.user as any;
  const userId = user?.id || user?._id;

  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      profileImageFile: undefined,
      bio: "",
      address: { street: "", city: "", country: "", zip: "" },
    },
  });

  // Fetch single user
  const { data: getSingleUser, isLoading, error } = useQuery({
    queryKey: ["singleUser", userId],
    queryFn: async (): Promise<ApiResponse> => {
      if (!userId) throw new Error("User ID is required");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/getsingeuser/${userId}`
      );
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    },
    enabled: !!userId && status === "authenticated",
  });

  // Populate form when API returns data
  useEffect(() => {
    const userData = getSingleUser?.user;
    if (userData) {
      form.reset({
        name: userData.name || "",
        email: userData.email || "",
        phoneNumber: userData.phoneNumber || "",
        profileImageFile: undefined,
        bio: userData.bio || "",
        address: {
          street: userData.address?.street || "",
          city: userData.address?.city || "",
          country: userData.address?.country || "",
          zip: userData.address?.zip || "",
        },
      });

      if (userData.profileImage) setImagePreview(userData.profileImage);
    }
  }, [getSingleUser, form]);

  // Fallback to session
  useEffect(() => {
    if (user && status === "authenticated" && !getSingleUser && !isLoading) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        profileImageFile: undefined,
        bio: user.bio || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          country: user.address?.country || "",
          zip: user.address?.zip || "",
        },
      });

      if (user.profileImage) setImagePreview(user.profileImage);
    }
  }, [user, status, getSingleUser, isLoading, form]);

  // Handle profile image preview
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "profileImageFile" && value.profileImageFile instanceof File) {
        const file = value.profileImageFile;
        if (!file.type.startsWith("image/")) {
          form.setError("profileImageFile", { type: "manual", message: "Invalid image file." });
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          form.setError("profileImageFile", { type: "manual", message: "Max size 5MB." });
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
      } else if (!value.profileImageFile) {
        setImagePreview(getSingleUser?.user?.profileImage || null);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, getSingleUser]);

  // Mutation to update user
  const updateUserMutation = useMutation<ApiResponse, Error, PersonalInfoFormValues>({
    mutationFn: async (data) => {
      if (!userId) throw new Error("User not authenticated");
      const formData = new FormData();
      formData.append("name", data.name.trim());
      formData.append("email", data.email.toLowerCase().trim());
      formData.append("phoneNumber", data.phoneNumber.trim());
      formData.append("bio", data.bio || "");
      formData.append("address[street]", data.address.street || "");
      formData.append("address[city]", data.address.city || "");
      formData.append("address[country]", data.address.country || "");
      formData.append("address[zip]", data.address.zip || "");
      if (data.profileImageFile) formData.append("image", data.profileImageFile);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/updateuser/${userId}`,
        { method: "PUT", body: formData }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to update profile");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["singleUser", userId] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update profile");
    },
  });

  const onSubmit = async (data: PersonalInfoFormValues) => {
    await updateUserMutation.mutateAsync(data);
  };

  if (status === "loading" || (isLoading && !getSingleUser)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4 sm:px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Authentication Required</h2>
        <p className="text-gray-600 mb-6 max-w-md">Please sign in to access and update your profile information.</p>
        <Button 
          onClick={() => (window.location.href = "/auth/signin")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full shadow-md text-lg"
        >
          Sign In Now
        </Button>
      </div>
    );
  }

  if (error && !getSingleUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4 sm:px-6">
        <h2 className="text-3xl font-bold text-red-600 mb-4">Error Loading Profile</h2>
        <p className="text-gray-600 mb-6 max-w-md">{error.message}</p>
        <Button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ["singleUser", userId] })}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full shadow-md text-lg"
        >
          Retry Loading
        </Button>
      </div>
    );
  }

  const currentUser = getSingleUser?.user || user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 sm:px-6 lg:px-8 py-[70px]">
      <div className="bg-white border border-indigo-100 overflow-hidden container mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 sm:px-8 py-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-md ring-4 ring-white/20">
            {imagePreview ? (
              <Image width={300} height={300} src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <UserCircleIcon className="w-16 h-16 sm:w-20 sm:h-20 text-indigo-300" />
            )}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">Personal Profile Settings</h2>
            <p className="text-indigo-100 text-base">Update your details to keep your account secure and personalized.</p>
            {currentUser?.name && <p className="text-yellow-200 text-lg font-medium mt-2">Hello, {currentUser.name}!</p>}
          </div>
        </div>

        {/* Form */}
        <div className="px-6 sm:px-8 py-8 sm:py-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Details Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 border-b border-indigo-100 pb-3">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Full Name *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your full name" 
                            disabled={updateUserMutation.isPending} 
                            className="border-indigo-200 focus:border-indigo-500 rounded-xl" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Email Address *</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="Enter your email" 
                            disabled={updateUserMutation.isPending} 
                            className="border-indigo-200 focus:border-indigo-500 rounded-xl" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Phone Number *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your phone number" 
                            disabled={updateUserMutation.isPending} 
                            className="border-indigo-200 focus:border-indigo-500 rounded-xl" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="profileImageFile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Profile Image (Max 5MB)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => field.onChange(e.target.files?.[0])} 
                              disabled={updateUserMutation.isPending} 
                              className="border-indigo-200 focus:border-indigo-500 rounded-xl file:bg-indigo-100 file:text-indigo-600 file:rounded-full file:px-4 file:py-2 file:mr-4" 
                            />
                            <CameraIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 pointer-events-none" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Bio (Optional, Max 200 characters)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about yourself..." 
                          maxLength={200} 
                          disabled={updateUserMutation.isPending} 
                          className="border-indigo-200 focus:border-indigo-500 rounded-xl min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <p className="text-sm text-gray-500 text-right mt-1">{(field.value || "").length}/200</p>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Address Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 border-b border-indigo-100 pb-3">Address Information (Optional)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {["street", "city", "country", "zip"].map((fieldName) => (
                    <FormField
                      key={fieldName}
                      control={form.control}
                      name={`address.${fieldName}` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={`Enter your ${fieldName}`} 
                              disabled={updateUserMutation.isPending} 
                              className="border-indigo-200 focus:border-indigo-500 rounded-xl" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-indigo-100 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={updateUserMutation.isPending}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full shadow-md text-lg font-semibold"
                >
                  {updateUserMutation.isPending ? "Updating Profile..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;