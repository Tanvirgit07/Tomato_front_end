import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MessageCircle, Heart, Share2, Calendar } from "lucide-react";

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-200 to-purple-200 px-4 py-2 rounded-full mb-4 shadow-sm">
            <span className="text-indigo-700 font-semibold text-sm">Our Blog</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-800 to-purple-600 bg-clip-text text-transparent mb-4">
            Beauty & Wellness Insights
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
            Dive into our curated collection of articles on beauty trends, product tips, and wellness inspiration to elevate your lifestyle.
          </p>
        </div>

        {/* Filters and Search (Top Section) */}
        <div className="mb-12">
          <Card className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-indigo-100 p-6">
            <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
              {/* Search */}
              <div className="w-full sm:w-1/2 md:w-1/3">
                <Label htmlFor="search" className="text-indigo-800 font-semibold">Search Articles</Label>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={20} />
                  <Input
                    id="search"
                    placeholder="Search for articles..."
                    className="pl-10 rounded-2xl border-indigo-200 focus:ring-indigo-500 bg-white/90 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Category Filter (Select) */}
              <div className="w-full sm:w-1/2 md:w-1/3">
                <Label htmlFor="category" className="text-indigo-800 font-semibold">Category</Label>
                <Select>
                  <SelectTrigger id="category" className="mt-2 rounded-2xl border-indigo-200 bg-white/90 focus:ring-indigo-500 transition-all duration-300">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl bg-white border-indigo-200">
                    {["All Categories", "Beauty Tips", "Product Guides", "Wellness", "Tutorials"].map((category) => (
                      <SelectItem key={category} value={category} className="text-gray-700 hover:bg-indigo-50">
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
          {[
            {
              id: 1,
              title: "Top 5 Skincare Tips for Glowing Skin",
              category: "Beauty Tips",
              excerpt: "Discover expert tips to achieve radiant, healthy skin with our daily skincare routine.",
              image: "https://images.unsplash.com/photo-1616394584738-fc6e6126b1c8?w=400&h=250&fit=crop",
              date: "August 10, 2025",
              comments: 12,
              likes: 45,
            },
            {
              id: 2,
              title: "How to Choose the Perfect Foundation",
              category: "Product Guides",
              excerpt: "Find the right foundation for your skin type with our comprehensive guide.",
              image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=250&fit=crop",
              date: "August 8, 2025",
              comments: 8,
              likes: 32,
            },
            {
              id: 3,
              title: "Mindfulness for Better Wellness",
              category: "Wellness",
              excerpt: "Learn how mindfulness can enhance your daily beauty and wellness routine.",
              image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=250&fit=crop",
              date: "August 5, 2025",
              comments: 15,
              likes: 50,
            },
            {
              id: 4,
              title: "Mastering Smokey Eye Makeup",
              category: "Tutorials",
              excerpt: "Step-by-step tutorial to create a stunning smokey eye look for any occasion.",
              image: "https://images.unsplash.com/photo-1512496015850-a8ee5066e54c?w=400&h=250&fit=crop",
              date: "August 3, 2025",
              comments: 10,
              likes: 28,
            },
          ].map((post) => (
            <Card
              key={post.id}
              className="group relative bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-indigo-100 animate-fade-in"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                  <div className="bg-indigo-100/90 backdrop-blur-sm text-indigo-800 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                    {post.category}
                  </div>
                </div>
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>

              {/* Content */}
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  <span>{post.date}</span>
                </div>
                <h3 className="text-xl font-bold text-indigo-900 line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </CardContent>

              {/* Footer: Comments and Reactions */}
              <CardFooter className="flex justify-between items-center p-6 pt-0 bg-gradient-to-t from-indigo-50/50 to-transparent">
                <div className="flex items-center gap-2 text-gray-600">
                  <MessageCircle className="w-5 h-5 text-indigo-500" />
                  <span className="text-sm font-medium">{post.comments} Comments</span>
                </div>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors duration-300">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </button>
                  <button className="text-gray-600 hover:text-indigo-600 transition-colors duration-300">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Load More Articles
          </Button>
        </div>
      </div>
    </main>
  );
}