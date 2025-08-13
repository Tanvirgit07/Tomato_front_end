'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, Eye, Heart, Share2, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Blog data
const blogData = [
  {
    id: 1,
    title: "10 Essential E-commerce Trends That Will Dominate 2024",
    slug: "ecommerce-trends-2024",
    excerpt: "Discover the game-changing trends that successful online retailers are implementing to stay ahead of the competition and boost their sales.",
    featuredImage: "/api/placeholder/800/400",
    category: "Trends",
    author: {
      name: "Sarah Mitchell",
      avatar: "",
      bio: "E-commerce Strategy Expert"
    },
    publishDate: "2024-01-15",
    readTime: 8,
    views: 2847,
    likes: 156,
    comments: 23,
    featured: true,
    trending: true
  },
  {
    id: 2,
    title: "How to Optimize Your Product Pages for Maximum Conversions",
    slug: "optimize-product-pages-conversions",
    excerpt: "Learn the proven strategies and techniques that can increase your product page conversion rates by up to 40% with these actionable tips.",
    featuredImage: "/api/placeholder/800/400",
    category: "Optimization",
    author: {
      name: "Mike Chen",
      avatar: "",
      bio: "Conversion Rate Specialist"
    },
    publishDate: "2024-01-12",
    readTime: 12,
    views: 1923,
    likes: 89,
    comments: 17,
    featured: false,
    trending: true
  },
  {
    id: 3,
    title: "The Complete Guide to Social Media Marketing for Online Stores",
    slug: "social-media-marketing-guide",
    excerpt: "Master the art of social media marketing with this comprehensive guide covering all major platforms and proven strategies for e-commerce success.",
    featuredImage: "/api/placeholder/800/400",
    category: "Marketing",
    author: {
      name: "Emma Rodriguez",
      avatar: "",
      bio: "Digital Marketing Manager"
    },
    publishDate: "2024-01-10",
    readTime: 15,
    views: 3421,
    likes: 234,
    comments: 45,
    featured: true,
    trending: false
  },
  {
    id: 4,
    title: "Building Customer Loyalty: 7 Proven Strategies That Actually Work",
    slug: "customer-loyalty-strategies",
    excerpt: "Transform one-time buyers into lifelong customers with these evidence-based loyalty strategies that have helped brands increase repeat purchases by 65%.",
    featuredImage: "/api/placeholder/800/400",
    category: "Customer Service",
    author: {
      name: "David Park",
      avatar: "",
      bio: "Customer Experience Lead"
    },
    publishDate: "2024-01-08",
    readTime: 10,
    views: 1567,
    likes: 112,
    comments: 28,
    featured: false,
    trending: true
  },
  {
    id: 5,
    title: "Mobile Commerce: Why Your Store Must Be Mobile-First in 2024",
    slug: "mobile-commerce-mobile-first",
    excerpt: "With 79% of smartphone users making purchases online, mobile optimization is no longer optional. Here's how to create a winning mobile strategy.",
    featuredImage: "/api/placeholder/800/400",
    category: "Technology",
    author: {
      name: "Lisa Wang",
      avatar: "",
      bio: "Mobile UX Designer"
    },
    publishDate: "2024-01-05",
    readTime: 9,
    views: 2156,
    likes: 178,
    comments: 19,
    featured: false,
    trending: false
  },
  {
    id: 6,
    title: "SEO for E-commerce: A Step-by-Step Guide to Organic Growth",
    slug: "ecommerce-seo-guide",
    excerpt: "Boost your organic traffic and sales with this comprehensive SEO guide specifically designed for e-commerce websites and online stores.",
    featuredImage: "/api/placeholder/800/400",
    category: "SEO",
    author: {
      name: "Tom Johnson",
      avatar: "",
      bio: "SEO Consultant"
    },
    publishDate: "2024-01-03",
    readTime: 18,
    views: 2789,
    likes: 145,
    comments: 32,
    featured: true,
    trending: false
  },
  {
    id: 7,
    title: "Email Marketing Automation: Convert More Leads Into Customers",
    slug: "email-marketing-automation",
    excerpt: "Discover how automated email sequences can nurture leads and drive sales 24/7, plus get our proven email templates that convert at 25%+.",
    featuredImage: "/api/placeholder/800/400",
    category: "Marketing",
    author: {
      name: "Anna Martinez",
      avatar: "",
      bio: "Email Marketing Expert"
    },
    publishDate: "2024-01-01",
    readTime: 11,
    views: 1834,
    likes: 93,
    comments: 15,
    featured: false,
    trending: false
  },
  {
    id: 8,
    title: "Inventory Management: Avoid Stockouts and Overstock Situations",
    slug: "inventory-management-tips",
    excerpt: "Master inventory management with proven techniques that reduce costs, prevent stockouts, and optimize your cash flow for sustainable growth.",
    featuredImage: "/api/placeholder/800/400",
    category: "Operations",
    author: {
      name: "Robert Kim",
      avatar: "",
      bio: "Operations Manager"
    },
    publishDate: "2023-12-28",
    readTime: 13,
    views: 1456,
    likes: 67,
    comments: 11,
    featured: false,
    trending: false
  }
];

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  publishDate: string;
  readTime: number;
  views: number;
  likes: number;
  comments: number;
  featured: boolean;
  trending: boolean;
}

const BlogSection = () => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleLike = (articleId: number) => {
    console.log(`Liked article ${articleId}`);
  };

  const handleShare = (articleId: number) => {
    console.log(`Shared article ${articleId}`);
  };

  const BlogCard = ({ article }: { article: BlogPost }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-none overflow-hidden opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]">
      <div className="relative aspect-video">
        <Image
          src={article.featuredImage}
          alt={article.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 left-4 flex gap-2">
          {article.featured && (
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
              Featured
            </Badge>
          )}
          {article.trending && (
            <Badge className="bg-red-500 text-white">
              Trending
            </Badge>
          )}
        </div>
      </div>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="text-xs">{article.category}</Badge>
          <div className="flex items-center text-xs text-gray-500 gap-4">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {article.views.toLocaleString()}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime} min
            </div>
          </div>
        </div>
        <Link href={`/blog/${article.slug}`}>
          <h3 className="font-bold text-lg md:text-xl text-gray-900 group-hover:text-blue-600 transition-colors mb-3 overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
            {article.title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm leading-relaxed mb-4 overflow-hidden [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical]">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={article.author.avatar} alt={article.author.name} />
              <AvatarFallback className="text-xs">{getInitials(article.author.name)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-sm text-gray-900">{article.author.name}</div>
              <div className="text-xs text-gray-500">{formatDate(article.publishDate)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleLike(article.id)}
              className="hover:text-red-500"
            >
              <Heart className="w-4 h-4" />
              <span className="ml-1 text-xs">{article.likes}</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleShare(article.id)}
              className="hover:text-blue-500"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section className="bg-gray-50 py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            Knowledge Hub
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
            Latest <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Blog Posts</span>
          </h2>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {blogData.slice(0, 8).map((article, index) => (
            <div
              key={article.id}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <BlogCard article={article} />
            </div>
          ))}
        </div>

        {/* Show All Blogs Button */}
        <div className="text-center mt-10 md:mt-12">
          <Button
            asChild
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Link href="/blog">
              Show All Blogs
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;