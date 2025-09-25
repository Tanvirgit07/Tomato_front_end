"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";
import Image from "next/image";
import { Calendar, User, Eye, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

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
      month: "long",
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-2xl">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Blog Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The blog post you're looking for doesn't exist.
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10">
      <div className="container mx-auto px-4 py-8">
        {/* Blog Header */}

        {/* Featured Image */}
        {blog.featuredImage?.url && (
          <div className="mb-12">
            <div className="relative rounded-2xl overflow-hidden p-2">
              <div className="relative w-full h-[350px] rounded-xl overflow-hidden">
                <Image
                  src={blog.featuredImage.url}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="my-8">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1"
                  >
                    {blog.category}
                  </Badge>
                  {!blog.isPublished && (
                    <Badge
                      variant="outline"
                      className="border-orange-200 text-orange-800 bg-orange-50"
                    >
                      Draft
                    </Badge>
                  )}
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {blog.title}
                </h1>

                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {blog.excerpt}
                </p>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 text-gray-500 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span className="font-medium text-gray-700">
                      {blog.user.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    <span>{blog.views.toLocaleString()} views</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Content */}
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardContent className="p-8 md:p-12">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />

            {/* Sub Images */}
            {blog.subImages && blog.subImages.length > 0 && (
              <div className="mt-12">
                <Separator className="mb-8" />
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Gallery
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {blog.subImages.map((image, index) => (
                    <div
                      key={image._id}
                      className="relative rounded-xl overflow-hidden shadow-lg bg-white p-2"
                    >
                      <div className="relative aspect-video rounded-lg overflow-hidden">
                        <Image
                          src={image.url}
                          alt={`Gallery image ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Author Card */}
        <Card className="mt-12 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {blog.user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {blog.user.name}
                </h3>
                <p className="text-gray-600">Author</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Separator className="mb-8" />
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Published: {formatDate(blog.createdAt)}</span>
            <span>Last updated: {formatDate(blog.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetails;
