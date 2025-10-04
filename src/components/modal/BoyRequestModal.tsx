"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Phone, MapPin, IdCard, User } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

// ✅ Zod validation schema
const formSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters."),
  phone: z.string().min(11, "Phone number must be valid."),
  area: z.string().min(2, "Area is required."),
  nid: z.string().min(10, "NID must be at least 10 digits."),
  age: z.string().min(1, "Age is required."),
  photo: z.any().optional(),
});

export function BoyRequestModal() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
const { data: session } = useSession();
  const user = session?.user as any;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      area: "",
      nid: "",
      age: "",
    },
  });

  // ✅ TanStack Mutation for Form Submit
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("phone", data.phone);
      formData.append("area", data.area);
      formData.append("nid", data.nid);
      formData.append("age", data.age);
      formData.append("email", user?.email);
      if (data.photo) {
        formData.append("image", data.photo);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/delivary/apply-delivary`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to submit form");
      }

      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data.message || "Application submitted successfully!");
      form.reset();
      setImagePreview(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "Something went wrong!");
    },
  });

  // ✅ Form Submit Handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  // ✅ Image Preview Handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("photo", file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-white text-blue-700 font-semibold hover:bg-blue-50 rounded-full shadow-lg"
        >
          Become a Delivery Man
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Become a Delivery Man 🚴‍♂️
          </DialogTitle>
          <DialogDescription>
            Fill out the form below to apply as a delivery partner.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Enter your full name"
                        className="pl-8"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="01XXXXXXXXX"
                        className="pl-8"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Area */}
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area / Zone</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Enter your area"
                        className="pl-8"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Age */}
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter your age"
                      min="18"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* NID */}
            <FormField
              control={form.control}
              name="nid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NID Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <IdCard className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                      <Input
                        type="number"
                        placeholder="Enter your NID number"
                        className="pl-8"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Photo Upload */}
            <FormItem>
              <FormLabel>Upload Your Photo</FormLabel>
              <FormControl>
                <div className="flex flex-col items-center gap-3 border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-blue-50 transition">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-28 h-28 rounded-full object-cover shadow-md"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-500">
                      <Upload className="w-6 h-6 mb-1" />
                      <span className="text-sm">Click to upload photo</span>
                    </div>
                  )}
                </div>
              </FormControl>
            </FormItem>

            {/* Buttons */}
            <DialogFooter className="flex justify-end gap-2 pt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isPending}
              >
                {isPending ? "Submitting..." : "Submit Request"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
