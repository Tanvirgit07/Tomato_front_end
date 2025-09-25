"use client";

import CommentModal from "@/components/modal/CommentModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Search, MessageCircle, Heart, Share2, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function BlogPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/blog/getallblog`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch blogs");
      }

      return res.json();
    },
  });

  // ✅ Adjust this based on your backend response
  const blogs = data?.blogs || data?.data || [];

  if (isLoading) {
    return (
      <main className="min-h-screen flex justify-center items-center">
        <p className="text-lg font-medium text-indigo-600">Loading blogs...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen flex justify-center items-center">
        <p className="text-red-500 font-medium">
          Error: {(error as Error).message}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-200 to-purple-200 px-4 py-2 rounded-full mb-4 shadow-sm">
            <span className="text-indigo-700 font-semibold text-sm">
              Our Blog
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-800 to-purple-600 bg-clip-text text-transparent mb-4">
            Beauty & Wellness Insights
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
            Dive into our curated collection of articles on beauty trends,
            product tips, and wellness inspiration to elevate your lifestyle.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-12">
          <Card className="rounded-3xl border border-indigo-100 p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
              {/* Search */}
              <div className="w-full sm:w-1/2 md:w-1/3">
                <Label
                  htmlFor="search"
                  className="text-indigo-800 font-semibold"
                >
                  Search Articles
                </Label>
                <div className="relative mt-2">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400"
                    size={20}
                  />
                  <Input
                    id="search"
                    placeholder="Search for articles..."
                    className="pl-10 rounded-2xl border-indigo-200 focus:ring-indigo-500 bg-white/90 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="w-full sm:w-auto">
                <Label
                  htmlFor="category"
                  className="text-indigo-800 font-semibold"
                >
                  Category
                </Label>
                <Select>
                  <SelectTrigger
                    id="category"
                    className="mt-2 rounded-2xl w-[300px] border-indigo-200 bg-white/90 focus:ring-indigo-500 transition-all duration-300"
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl bg-white border-indigo-200">
                    {[
                      "All Categories",
                      "Beauty Tips",
                      "Product Guides",
                      "Wellness",
                      "Tutorials",
                    ].map((category) => (
                      <SelectItem
                        key={category}
                        value={category}
                        className="text-gray-700 hover:bg-indigo-50"
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center">
              No blogs found.
            </p>
          ) : (
            blogs.map((post: any) => (
              <Card
                key={post._id}
                className="group relative bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-indigo-100 animate-fade-in"
              >
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <Link href={`/blog/${post?._id}`}>
                    <Image
                      width={400}
                      height={400}
                      src={post.featuredImage?.url || "/placeholder.jpg"}
                      alt={post.title}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </Link>
                  {/* Category Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-indigo-100/90 backdrop-blur-sm text-indigo-800 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                      {post.category || "Uncategorized"}
                    </div>
                  </div>
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>

                {/* Content */}
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    <span>
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString()
                        : "Unknown date"}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-indigo-900 line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                    {post.excerpt || "No excerpt available"}
                  </p>
                </CardContent>

                {/* Footer: Comments and Reactions */}
                <CardFooter className="flex justify-between items-center p-6 pt-0 bg-gradient-to-t from-indigo-50/50 to-transparent">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CommentModal blogId={post._id} />
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors duration-300">
                      <Heart className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        {post.views || 0}
                      </span>
                    </button>
                    <button className="text-gray-600 hover:text-indigo-600 transition-colors duration-300">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Load More Articles
          </Button>
        </div>
      </div>
    </main>
  );
}
