"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-10 max-w-6xl mx-auto min-h-screen flex flex-col justify-center px-6 py-8"
      >
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left side: Image */}
          <div className="w-full md:w-1/2 rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/images/signUp.jpg"
              alt="signup image"
              width={500}
              height={500}
              className="object-cover w-full h-full"
              priority
            />
          </div>

          {/* Right side: Form */}
          <div className="w-full md:w-1/2 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-600 mt-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="******" type="password" {...field} />
                    </FormControl>
                    <FormMessage className="text-sm text-red-600 mt-1" />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="mt-8 w-full py-3 text-lg font-semibold"
            >
              Login
            </Button>
          </div>
          <p></p>
        </div>
      </form>
    </Form>
  );
}
