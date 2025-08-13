import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Heart, Globe, Star } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 rounded-full mb-4">
            <span className="text-indigo-600 font-medium text-sm">About Us</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
            Our Story
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">
            Discover who we are, what drives us, and how we’re redefining beauty with premium products crafted for you.
          </p>
        </div>

        {/* Our Story Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Who We Are</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Founded in 2020, our e-commerce brand is dedicated to delivering high-quality beauty products that empower confidence and self-expression. From skin care to makeup, we source the finest ingredients to create products that blend luxury with affordability.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Our journey began with a simple idea: beauty should be accessible, sustainable, and innovative. Today, we’re proud to serve customers worldwide, offering products that celebrate individuality and enhance natural beauty.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1516321310762-479d72a09b33?w=600&h=400&fit=crop"
                alt="Our Story"
                className="w-full h-80 object-cover rounded-3xl shadow-lg transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl" />
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Our Mission
            </h2>
            <p className="text-slate-600 max-w-3xl mx-auto mt-4">
              To inspire confidence through sustainable, innovative, and inclusive beauty solutions that empower everyone to feel their best.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100">
              <CardHeader>
                <Globe className="w-8 h-8 text-indigo-600 mb-2" />
                <CardTitle className="text-xl font-bold text-slate-800">Sustainability</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600">
                  We prioritize eco-friendly packaging and ethically sourced ingredients to minimize our environmental impact.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100">
              <CardHeader>
                <Heart className="w-8 h-8 text-indigo-600 mb-2" />
                <CardTitle className="text-xl font-bold text-slate-800">Inclusivity</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600">
                  Our products are designed for all skin types, tones, and preferences, celebrating diversity in beauty.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100">
              <CardHeader>
                <Star className="w-8 h-8 text-indigo-600 mb-2" />
                <CardTitle className="text-xl font-bold text-slate-800">Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600">
                  We embrace cutting-edge technology to create products that deliver visible results and lasting impact.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Our Team Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Meet Our Team
            </h2>
            <p className="text-slate-600 max-w-3xl mx-auto mt-4">
              Our passionate team is dedicated to bringing you the best in beauty, with expertise and creativity at the heart of everything we do.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Jane Doe",
                role: "Founder & CEO",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
              },
              {
                name: "Sarah Smith",
                role: "Product Manager",
                image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop",
              },
              {
                name: "Michael Brown",
                role: "Lead Designer",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop",
              },
              {
                name: "Emily Johnson",
                role: "Marketing Director",
                image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop",
              },
            ].map((member) => (
              <Card
                key={member.name}
                className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100"
              >
                <CardContent className="p-6 text-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-lg font-bold text-slate-800">{member.name}</h3>
                  <p className="text-slate-600 text-sm">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
            Join Our Journey
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-6">
            Explore our premium beauty products and become part of our mission to redefine beauty with innovation and care.
          </p>
          <Button
            className="bg-gradient-to-r from-orange-500 to-red-400 hover:from-indigo-600 hover:to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
            asChild
          >
            <a href="/products">Shop Now</a>
          </Button>
        </section>
      </div>
    </main>
  );
}