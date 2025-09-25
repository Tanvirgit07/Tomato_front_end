"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";

// Validation Schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." }),
});

export default function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", values);
    setIsSubmitted(true);
    form.reset();
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="relative py-20 px-4 bg-gradient-to-r from-indigo-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Get in Touch
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Have questions or feedback? We’d love to hear from you. Reach out to us directly or send us a message.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left Side: Contact Information */}
          <Card className="shadow-lg p-6 hover:shadow-xl transition rounded-2xl border-0 bg-gradient-to-br from-white to-indigo-50">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Contact Information</CardTitle>
              <CardDescription className="text-gray-600">
                Reach out to us directly or use the form.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  icon: Mail,
                  title: "Email",
                  value: "support@example.com",
                },
                {
                  icon: Phone,
                  title: "Phone",
                  value: "+1 (123) 456-7890",
                },
                {
                  icon: MapPin,
                  title: "Address",
                  value: "123 Main St, City, Country",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-3 rounded-lg bg-white shadow-sm hover:shadow-md hover:scale-[1.02] transition"
                >
                  <item.icon className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.value}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Right Side: Contact Form */}
          <Card className="shadow-lg p-6 hover:shadow-xl transition rounded-2xl border-0 bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Send Us a Message</CardTitle>
              <CardDescription className="text-gray-600">
                We&apos;ll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted && (
                <div className="mb-4 flex items-center gap-2 p-4 bg-green-100 text-green-700 rounded-lg">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Message sent successfully!</span>
                </div>
              )}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your name"
                            {...field}
                            className="rounded-lg"
                          />
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            {...field}
                            className="rounded-lg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your message"
                            rows={4}
                            {...field}
                            className="rounded-lg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full rounded-lg text-white font-medium bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition"
                  >
                    Send Message
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
