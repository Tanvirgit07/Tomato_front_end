"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";
import Image from "next/image";
import {
  Calendar,
  Eye,
  ArrowLeft,
  Share2,
  Linkedin,
  Twitter,
  Facebook,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import BologComment from "./BologComment";

interface BlogData {
  success: boolean;
  data: {
    featuredImage: {
      url: string;
      publicId: string;
    };
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    subImages: Array<{
      url: string;
      publicId: string;
      _id: string;
    }>;
    category: string;
    user: {
      _id: string;
      name: string;
      email: string;
    };
    views: number;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

function BlogDetails() {
  const params = useParams();
  const blogId = params.id;

  const {
    data: blogDetails,
    isLoading,
    isError,
    error,
  } = useQuery<BlogData>({
    queryKey: ["single-blog", blogId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/blog/getsingleblog/${blogId}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch blog details");
      }

      return res.json();
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blogDetails?.data.title,
          text: blogDetails?.data.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Header Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-8 w-32 mb-4" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>

          {/* Featured Image Skeleton */}
          <Skeleton className="w-full h-96 rounded-2xl mb-8" />

          {/* Content Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6">
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              Failed to load blog details. Please try again later.
              <br />
              <span className="text-sm text-red-600">
                {error instanceof Error
                  ? error.message
                  : "Unknown error occurred"}
              </span>
            </AlertDescription>
          </Alert>
          <div className="mt-6 text-center">
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!blogDetails?.data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Blog Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The blog post you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const blog = blogDetails.data;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-12">
          {/* Left Sidebar - Author Info */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
              {/* Author Card */}
              <div className="text-center mb-8">
                {/* Avatar */}
                <div className="w-28 h-28 mx-auto mb-4 bg-gradient-to-tr from-purple-400 via-pink-400 to-red-400 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-md">
                  {blog.user.name.charAt(0).toUpperCase()}
                </div>

                {/* Author Info */}
                <h3 className="font-semibold text-gray-900 text-xl mb-1">
                  {blog.user.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Published: {formatDate(blog.createdAt)}
                </p>

                {/* Author Bio */}
                <p className="text-sm text-gray-500 italic mb-4">
                  Passionate writer, sharing thoughts on{" "}
                  <span className="font-medium text-gray-700">
                    {blog.category}
                  </span>
                </p>

                {/* Social Links */}
                <div className="flex justify-center gap-3 mb-5">
                  <button className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow">
                    <Linkedin className="w-4 h-4" />
                  </button>
                  <button className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-400 text-white hover:bg-blue-500 transition-colors shadow">
                    <Twitter className="w-4 h-4" />
                  </button>
                  <button className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-800 text-white hover:bg-blue-900 transition-colors shadow">
                    <Facebook className="w-4 h-4" />
                  </button>
                </div>

                {/* Follow Button */}
                <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium shadow hover:scale-105 transition-transform">
                  Follow Author
                </button>
              </div>

              {/* Blog Stats */}
              <div className="space-y-4 text-sm text-gray-600 border-t pt-5">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-500" />
                  <span>{blog.views.toLocaleString()} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>Updated: {formatDate(blog.updatedAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-green-500" />
                  <span>
                    Total Blogs: <b>24</b>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            {/* Category Badge */}
            <div className="mb-6">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1 text-sm">
                {blog.category}
              </Badge>
              {!blog.isPublished && (
                <Badge
                  variant="outline"
                  className="ml-2 border-orange-200 text-orange-800 bg-orange-50"
                >
                  Draft
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-700 mb-8 leading-relaxed font-light">
              {blog.excerpt}
            </p>

            {/* Featured Image */}
            {blog.featuredImage?.url && (
              <div className="mb-12">
                <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={blog.featuredImage.url}
                    alt={blog.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            )}

            {/* Blog Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <div
                className="text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>

            {/* Sub Images Gallery */}
            {blog.subImages && blog.subImages.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Gallery
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {blog.subImages.map((image, index) => (
                    <div
                      key={image._id}
                      className="relative aspect-video rounded-lg overflow-hidden shadow-lg"
                    >
                      <Image
                        src={image.url}
                        alt={`Gallery image ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Share Section */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Share this article
                  </h4>
                  <p className="text-sm text-gray-600">
                    Help others discover this content
                  </p>
                </div>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
              <div className="mt-10">
                <BologComment />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetails;
