"use client";

import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  Eye,
  Heart,
  Share2,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Sample Blog Data (replace with API data)
const blogData = [
  {
    id: 1,
    title: "10 Essential E-commerce Trends That Will Dominate 2024",
    slug: "ecommerce-trends-2024",
    excerpt:
      "Discover the game-changing trends that successful online retailers are implementing to stay ahead of the competition and boost their sales.",
    featuredImage: "/images/header_img.png",
    category: "Trends",
    author: {
      name: "Sarah Mitchell",
      avatar: "",
      bio: "E-commerce Strategy Expert",
    },
    publishDate: "2024-01-15",
    readTime: 8,
    views: 2847,
    likes: 156,
    comments: 23,
    featured: true,
    trending: true,
  },
  {
    id: 1,
    title: "10 Essential E-commerce Trends That Will Dominate 2024",
    slug: "ecommerce-trends-2024",
    excerpt:
      "Discover the game-changing trends that successful online retailers are implementing to stay ahead of the competition and boost their sales.",
    featuredImage: "/images/header_img.png",
    category: "Trends",
    author: {
      name: "Sarah Mitchell",
      avatar: "",
      bio: "E-commerce Strategy Expert",
    },
    publishDate: "2024-01-15",
    readTime: 8,
    views: 2847,
    likes: 156,
    comments: 23,
    featured: true,
    trending: true,
  },
  {
    id: 1,
    title: "10 Essential E-commerce Trends That Will Dominate 2024",
    slug: "ecommerce-trends-2024",
    excerpt:
      "Discover the game-changing trends that successful online retailers are implementing to stay ahead of the competition and boost their sales.",
    featuredImage: "/images/header_img.png",
    category: "Trends",
    author: {
      name: "Sarah Mitchell",
      avatar: "",
      bio: "E-commerce Strategy Expert",
    },
    publishDate: "2024-01-15",
    readTime: 8,
    views: 2847,
    likes: 156,
    comments: 23,
    featured: true,
    trending: true,
  },
  {
    id: 1,
    title: "10 Essential E-commerce Trends That Will Dominate 2024",
    slug: "ecommerce-trends-2024",
    excerpt:
      "Discover the game-changing trends that successful online retailers are implementing to stay ahead of the competition and boost their sales.",
    featuredImage: "/images/header_img.png",
    category: "Trends",
    author: {
      name: "Sarah Mitchell",
      avatar: "",
      bio: "E-commerce Strategy Expert",
    },
    publishDate: "2024-01-15",
    readTime: 8,
    views: 2847,
    likes: 156,
    comments: 23,
    featured: true,
    trending: true,
  },
  {
    id: 1,
    title: "10 Essential E-commerce Trends That Will Dominate 2024",
    slug: "ecommerce-trends-2024",
    excerpt:
      "Discover the game-changing trends that successful online retailers are implementing to stay ahead of the competition and boost their sales.",
    featuredImage: "/images/header_img.png",
    category: "Trends",
    author: {
      name: "Sarah Mitchell",
      avatar: "",
      bio: "E-commerce Strategy Expert",
    },
    publishDate: "2024-01-15",
    readTime: 8,
    views: 2847,
    likes: 156,
    comments: 23,
    featured: true,
    trending: true,
  },
  {
    id: 1,
    title: "10 Essential E-commerce Trends That Will Dominate 2024",
    slug: "ecommerce-trends-2024",
    excerpt:
      "Discover the game-changing trends that successful online retailers are implementing to stay ahead of the competition and boost their sales.",
    featuredImage: "/images/header_img.png",
    category: "Trends",
    author: {
      name: "Sarah Mitchell",
      avatar: "",
      bio: "E-commerce Strategy Expert",
    },
    publishDate: "2024-01-15",
    readTime: 8,
    views: 2847,
    likes: 156,
    comments: 23,
    featured: true,
    trending: true,
  },
  {
    id: 1,
    title: "10 Essential E-commerce Trends That Will Dominate 2024",
    slug: "ecommerce-trends-2024",
    excerpt:
      "Discover the game-changing trends that successful online retailers are implementing to stay ahead of the competition and boost their sales.",
    featuredImage: "/images/header_img.png",
    category: "Trends",
    author: {
      name: "Sarah Mitchell",
      avatar: "",
      bio: "E-commerce Strategy Expert",
    },
    publishDate: "2024-01-15",
    readTime: 8,
    views: 2847,
    likes: 156,
    comments: 23,
    featured: true,
    trending: true,
  },
  {
    id: 1,
    title: "10 Essential E-commerce Trends That Will Dominate 2024",
    slug: "ecommerce-trends-2024",
    excerpt:
      "Discover the game-changing trends that successful online retailers are implementing to stay ahead of the competition and boost their sales.",
    featuredImage: "/images/header_img.png",
    category: "Trends",
    author: {
      name: "Sarah Mitchell",
      avatar: "",
      bio: "E-commerce Strategy Expert",
    },
    publishDate: "2024-01-15",
    readTime: 8,
    views: 2847,
    likes: 156,
    comments: 23,
    featured: true,
    trending: true,
  },
];

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  author: { name: string; avatar: string; bio: string };
  publishDate: string;
  readTime: number;
  views: number;
  likes: number;
  comments: number;
  featured: boolean;
  trending: boolean;
}

// Memoized BlogCard
const BlogCard = memo(({ article }: { article: BlogPost }) => {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <Card
      className="group flex flex-col h-full border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
      role="article"
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={article.featuredImage}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {article.featured && (
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              Featured
            </Badge>
          )}
          {article.trending && (
            <Badge className="bg-red-500 text-white">Trending</Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-5 flex flex-col flex-grow">
        {/* Meta */}
        <div className="flex items-center justify-between mb-3 text-sm text-gray-500 dark:text-gray-400">
          <Badge
            variant="outline"
            className="border-gray-300 dark:border-gray-600"
          >
            {article.category}
          </Badge>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {article.views.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {article.readTime} min
            </span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/blog/${article.slug}`}>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
            {article.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 mb-4 line-clamp-3 flex-grow">
          {article.excerpt}
        </p>

        {/* Author & Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Avatar className="w-9 h-9">
              <AvatarImage
                src={article.author.avatar}
                alt={article.author.name}
              />
              <AvatarFallback>
                {getInitials(article.author.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-sm">{article.author.name}</div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />{" "}
                {formatDate(article.publishDate)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="hover:text-red-500">
              <Heart className="w-4 h-4" />{" "}
              <span className="ml-1 text-xs">{article.likes}</span>
            </Button>
            <Button size="sm" variant="ghost" className="hover:text-blue-500">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
BlogCard.displayName = "BlogCard";

// Blog Section
const BlogSection = () => {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" /> Knowledge Hub
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Latest{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Blog Posts
            </span>
          </h2>
        </div>

        {/* Blog Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {blogData.map((article, index) => (
            <div
              key={article.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <BlogCard article={article} />
            </div>
          ))}
        </div>

        {/* Show All Button */}
        <div className="text-center mt-12">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-orange-400 to-red-400 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <Link href="/blog">
              Show All Blogs <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
