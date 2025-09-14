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

// Zod schema
const personalInfoSchema = z.object({
  name: z.string().min(2).max(50).trim(),
  email: z.string().email().trim().toLowerCase(),
  phoneNumber: z.string().min(10).trim(),
  profileImageFile: z.any().optional(),
  bio: z.string().max(200).optional(),
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-semibold mb-2">Authentication Required</h2>
        <p className="mb-4">Please log in to update your profile.</p>
        <Button onClick={() => (window.location.href = "/auth/signin")}>Go to Sign In</Button>
      </div>
    );
  }

  if (error && !getSingleUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-semibold mb-2">Error Loading Profile</h2>
        <p className="mb-4">{error.message}</p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["singleUser", userId] })}>Retry</Button>
      </div>
    );
  }

  const currentUser = getSingleUser?.user || user;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100 flex items-center gap-6">
          <div className="relative w-20 h-20 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center overflow-hidden">
            {imagePreview ? (
              <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="text-white text-2xl font-semibold">
                {currentUser?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-1">Update Personal Details</h2>
            <p className="text-gray-500 text-sm">Keep your profile information up to date</p>
            {currentUser?.name && <p className="text-blue-600 text-sm font-medium">Welcome back, {currentUser.name}!</p>}
          </div>
        </div>

        {/* Form */}
        <div className="px-8 py-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Name" disabled={updateUserMutation.isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email*</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email" disabled={updateUserMutation.isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Phone & Profile Image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number*</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone Number" disabled={updateUserMutation.isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="profileImageFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Image (Max 5MB)</FormLabel>
                      <FormControl>
                        <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files?.[0])} disabled={updateUserMutation.isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Bio */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio ({(field.value || "").length}/200)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="About you" maxLength={200} disabled={updateUserMutation.isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b border-gray-200 pb-2">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {["street", "city", "country", "zip"].map((fieldName) => (
                    <FormField
                      key={fieldName}
                      control={form.control}
                      name={`address.${fieldName}` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}</FormLabel>
                          <FormControl>
                            <Input placeholder={fieldName} disabled={updateUserMutation.isPending} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="pt-6 border-t border-gray-100">
                <Button type="submit" disabled={updateUserMutation.isPending}>
                  {updateUserMutation.isPending ? "Updating..." : "Update Profile"}
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
