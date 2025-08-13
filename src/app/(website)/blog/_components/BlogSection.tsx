'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Eye,
  Heart,
  Share2,
  TrendingUp,
  BookOpen,
  Search,
  ArrowRight,
  Tag,
  Bookmark,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Blog data (same as provided)
const blogData = [
  {
    id: 1,
    title: "10 Essential E-commerce Trends That Will Dominate 2024",
    slug: "ecommerce-trends-2024",
    excerpt: "Discover the game-changing trends that successful online retailers are implementing to stay ahead of the competition and boost their sales.",
    content: "The e-commerce landscape is evolving rapidly, with new technologies and consumer behaviors reshaping how we shop online...",
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
    tags: ["E-commerce", "Trends", "Technology", "Business"],
    featured: true,
    trending: true
  },
  {
    id: 2,
    title: "How to Optimize Your Product Pages for Maximum Conversions",
    slug: "optimize-product-pages-conversions",
    excerpt: "Learn the proven strategies and techniques that can increase your product page conversion rates by up to 40% with these actionable tips.",
    content: "Product page optimization is crucial for e-commerce success. Here are the key elements that make customers click 'Add to Cart'...",
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
    tags: ["Conversion", "UX", "Product Pages", "CRO"],
    featured: false,
    trending: true
  },
  {
    id: 3,
    title: "The Complete Guide to Social Media Marketing for Online Stores",
    slug: "social-media-marketing-guide",
    excerpt: "Master the art of social media marketing with this comprehensive guide covering all major platforms and proven strategies for e-commerce success.",
    content: "Social media has become an indispensable tool for e-commerce businesses. Here's how to leverage it effectively...",
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
    tags: ["Social Media", "Marketing", "Branding", "Strategy"],
    featured: true,
    trending: false
  },
  {
    id: 4,
    title: "Building Customer Loyalty: 7 Proven Strategies That Actually Work",
    slug: "customer-loyalty-strategies",
    excerpt: "Transform one-time buyers into lifelong customers with these evidence-based loyalty strategies that have helped brands increase repeat purchases by 65%.",
    content: "Customer loyalty is the backbone of sustainable e-commerce growth. These strategies will help you build lasting relationships...",
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
    tags: ["Customer Loyalty", "Retention", "CX", "Growth"],
    featured: false,
    trending: true
  },
  {
    id: 5,
    title: "Mobile Commerce: Why Your Store Must Be Mobile-First in 2024",
    slug: "mobile-commerce-mobile-first",
    excerpt: "With 79% of smartphone users making purchases online, mobile optimization is no longer optional. Here's how to create a winning mobile strategy.",
    content: "Mobile commerce continues to grow exponentially. Here's what you need to know to succeed in the mobile-first world...",
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
    tags: ["Mobile", "UX", "Technology", "Responsive"],
    featured: false,
    trending: false
  },
  {
    id: 6,
    title: "SEO for E-commerce: A Step-by-Step Guide to Organic Growth",
    slug: "ecommerce-seo-guide",
    excerpt: "Boost your organic traffic and sales with this comprehensive SEO guide specifically designed for e-commerce websites and online stores.",
    content: "SEO is crucial for long-term e-commerce success. This guide covers everything from keyword research to technical optimization...",
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
    tags: ["SEO", "Organic Traffic", "Growth", "Content"],
    featured: true,
    trending: false
  },
  {
    id: 7,
    title: "Email Marketing Automation: Convert More Leads Into Customers",
    slug: "email-marketing-automation",
    excerpt: "Discover how automated email sequences can nurture leads and drive sales 24/7, plus get our proven email templates that convert at 25%+.",
    content: "Email marketing automation is one of the highest ROI marketing channels. Here's how to set up campaigns that convert...",
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
    tags: ["Email Marketing", "Automation", "Conversion", "Nurturing"],
    featured: false,
    trending: false
  },
  {
    id: 8,
    title: "Inventory Management: Avoid Stockouts and Overstock Situations",
    slug: "inventory-management-tips",
    excerpt: "Master inventory management with proven techniques that reduce costs, prevent stockouts, and optimize your cash flow for sustainable growth.",
    content: "Effective inventory management is critical for e-commerce profitability. Learn the systems and strategies that work...",
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
    tags: ["Inventory", "Operations", "Cash Flow", "Efficiency"],
    featured: false,
    trending: false
  }
];

const categories = ["All", "Trends", "Marketing", "Optimization", "Technology", "Customer Service", "SEO", "Operations"];

const BlogSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    let filtered = blogData.filter(article => {
      const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.views - a.views;
        case "trending":
          return b.trending - a.trending || b.likes - a.likes;
        case "newest":
        default:
          return new Date(b.publishDate) - new Date(a.publishDate);
      }
    });

    return filtered;
  }, [selectedCategory, searchQuery, sortBy]);

  // Get featured and trending articles
  const featuredArticles = useMemo(() => blogData.filter(article => article.featured).slice(0, 3), []);
  const trendingArticles = useMemo(() => blogData.filter(article => article.trending).slice(0, 5), []);

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

  const handleBookmark = (articleId: number) => {
    console.log(`Bookmarked article ${articleId}`);
  };

  const handleShare = (articleId: number) => {
    console.log(`Shared article ${articleId}`);
  };

  interface ArticleCardProps {
    article: typeof blogData[0];
    variant?: 'default' | 'featured';
  }

  const ArticleCard = ({ article, variant = 'default' }: ArticleCardProps) => (
    <Card className={`group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-none overflow-hidden
      ${variant === 'featured' ? 'lg:flex lg:flex-row' : ''}`}>
      <div className={`relative ${variant === 'featured' ? 'lg:w-1/2' : ''}`}>
        <div className="relative aspect-video">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="absolute top-4 left-4 flex gap-2">
          {article.featured && (
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
              Featured
            </Badge>
          )}
          {article.trending && (
            <Badge className="bg-red-500 text-white">
              <TrendingUp className="w-3 h-3 mr-1" />
              Trending
            </Badge>
          )}
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-4 right-4 bg-white/90 hover:bg-white shadow-md"
          onClick={() => handleBookmark(article.id)}
        >
          <Bookmark className="w-4 h-4" />
        </Button>
      </div>
      <CardContent className={`p-6 ${variant === 'featured' ? 'lg:w-1/2 flex flex-col justify-between' : ''}`}>
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
          <h3 className={`font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-3 line-clamp-2
            ${variant === 'featured' ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'}`}>
            {article.title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{article.excerpt}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-200">
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </Badge>
          ))}
          {article.tags.length > 3 && (
            <Badge variant="secondary" className="bg-gray-100 text-gray-600">+{article.tags.length - 3}</Badge>
          )}
        </div>
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

  interface TrendingCardProps {
    article: typeof blogData[0];
    index: number;
  }

  const TrendingCard = ({ article, index }: TrendingCardProps) => (
    <Link href={`/blog/${article.slug}`}>
      <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors group">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
            {article.title}
          </h4>
          <div className="flex items-center text-xs text-gray-500 gap-2">
            <span>{formatDate(article.publishDate)}</span>
            <span>•</span>
            <span>{article.views.toLocaleString()} views</span>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
      </div>
    </Link>
  );

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            Knowledge Hub
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Blog & <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Expert Tips</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Stay ahead with insights, strategies, and actionable tips from e-commerce experts.
          </p>
        </div>

        {/* Featured Articles */}
        <section className="mb-12 md:mb-16">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Featured Articles</h2>
            <Button variant="outline" className="hidden sm:flex">
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="featured" />
            ))}
          </div>
        </section>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Articles Section */}
          <div className="lg:col-span-3">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 md:mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Articles Grid */}
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {filteredArticles.map((article, index) => (
                  <div
                    key={article.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ArticleCard article={article} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Load More */}
            <div className="text-center mt-8 md:mt-12">
              <Button size="lg" variant="outline">
                Load More Articles
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 md:space-y-8">
            {/* Trending Now */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-red-500" />
                  <h3 className="font-semibold text-gray-900">Trending Now</h3>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {trendingArticles.map((article, index) => (
                    <TrendingCard key={article.id} article={article} index={index} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-none">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">Stay Updated</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Get the latest e-commerce tips delivered weekly.
                </p>
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="text-gray-900 placeholder-gray-500"
                  />
                  <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
                    Subscribe Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-900">Popular Tags</h3>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {["E-commerce", "Marketing", "SEO", "Conversion", "UX", "Social Media", "Email", "Mobile", "Analytics", "Growth"].map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer hover:bg-blue-100 hover:text-blue-700"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      Global Styles
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default BlogSection;