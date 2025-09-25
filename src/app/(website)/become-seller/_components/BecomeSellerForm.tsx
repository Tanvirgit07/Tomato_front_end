/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, { message: "Shop name must be at least 2 characters." }),
  logo: z.string().min(1, { message: "Logo is required (use initials or short code)." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  founded: z.string().min(4, { message: "Founded year is required." }),
  rating: z.string().min(1, { message: "Rating is required." }),
  products: z.string().min(1, { message: "Products count is required." }),
  verified: z.any(),
  featured: z.any(),
  color: z.string().min(1, { message: "Pick a primary color." }),
  lightColor: z.string().min(1, { message: "Pick a light color." }),
  website: z.string().url({ message: "Please enter a valid website URL." }),
});

export function BecomeSellerForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      logo: "",
      description: "",
      founded: "",
      rating: "",
      products: "",
      verified: false,
      featured: false,
      color: "#ec4899",
      lightColor: "#fce7f3",
      website: "",
    },
  });

  const { data: session } = useSession();
  const user = session?.user as any;
  const email = user?.email;

  const sellerMutation = useMutation({
    mutationFn: async (bodyData: any) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/seller/become-seller`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyData),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to submit application");
      }
      return res.json();
    },
    onSuccess: () => toast.success("Seller application submitted successfully!"),
    onError: (error: any) => toast.error(error.message || "Something went wrong"),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    sellerMutation.mutate({ ...values, email });
  };

  return (
    <div className="py-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-purple-100 max-w-3xl mx-auto">
        {/* <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-6">
          Become a Seller
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Fill out the form below to start your seller journey.
        </p> */}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shop Name</FormLabel>
                    <FormControl>
                      <Input placeholder="FashionHub" {...field} className="rounded-xl border-gray-300 shadow-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo (short code)</FormLabel>
                    <FormControl>
                      <Input placeholder="FH" {...field} className="rounded-xl border-gray-300 shadow-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="founded"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Founded Year</FormLabel>
                    <FormControl>
                      <Input placeholder="2016" {...field} className="rounded-xl border-gray-300 shadow-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="4.5" {...field} className="rounded-xl border-gray-300 shadow-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="products"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Products</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="445" {...field} className="rounded-xl border-gray-300 shadow-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Color</FormLabel>
                    <FormControl>
                      <Input type="color" {...field} className="h-12 w-full cursor-pointer rounded-xl border" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lightColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Light Color</FormLabel>
                    <FormControl>
                      <Input type="color" {...field} className="h-12 w-full cursor-pointer rounded-xl border" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Trendy clothing and fashion accessories"
                      {...field}
                      className="rounded-xl border-gray-300 shadow-sm"
                    />
                  </FormControl>
                  <FormDescription>Tell customers about your shop.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://fashionhub.com" {...field} className="rounded-xl border-gray-300 shadow-sm" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-6 flex-wrap">
              <FormField
                control={form.control}
                name="verified"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>Verified Seller</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>Featured Seller</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 shadow-md"
            >
              Submit Application
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
