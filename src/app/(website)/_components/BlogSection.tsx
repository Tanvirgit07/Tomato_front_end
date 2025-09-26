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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, MessageCircle, Heart, Share2, Calendar } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function BlogPage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const token = user?.accessToken;
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/blog/getallblog`
      );

      if (!res.ok) throw new Error("Failed to fetch blogs");
      return res.json();
    },
  });

  const addLikeMutation = useMutation({
    mutationFn: async (blogId: string) => {
      if (!token) throw new Error("User not authenticated");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/blog/addlike/${blogId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to like/unlike blog");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });

  const blogs = data?.blogs || data?.data || [];

  if (isLoading)
    return (
      <main className="min-h-screen flex justify-center items-center">
        <p className="text-lg font-medium text-indigo-600">Loading blogs...</p>
      </main>
    );

  if (isError)
    return (
      <main className="min-h-screen flex justify-center items-center">
        <p className="text-red-500 font-medium">
          Error: {(error as Error).message}
        </p>
      </main>
    );

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
        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-8">
          {blogs.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center">
              No blogs found.
            </p>
          ) : (
            blogs.slice(0, 8).map((post: any) => (
              <Card
                key={post._id}
                className="group relative bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-indigo-100 animate-fade-in"
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <Link href={`/blog/${post._id}`}>
                    <Image
                      width={400}
                      height={400}
                      src={post.featuredImage?.url || "/placeholder.jpg"}
                      alt={post.title}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </Link>
                  <div className="absolute top-4 right-4">
                    <div className="bg-indigo-100/90 backdrop-blur-sm text-indigo-800 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                      {post.category || "Uncategorized"}
                    </div>
                  </div>
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

                {/* Footer */}
                <CardFooter className="flex justify-between items-center p-6 pt-0 bg-gradient-to-t from-indigo-50/50 to-transparent">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Link href={`/blog/${post._id}#comment`}>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors duration-300">
                        <MessageCircle className="w-5 h-5 text-indigo-500" />
                        <span className="text-sm font-medium">Add Comment</span>
                      </button>
                    </Link>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => addLikeMutation.mutate(post._id)}
                      className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors duration-300"
                    >
                      <Heart className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        {post.likes?.length || 0}
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

        {/* Load More */}
        <div className="text-center mt-12">
          <Link href="/blog">
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              All Blgos
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
