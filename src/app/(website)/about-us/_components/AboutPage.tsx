import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import abutimage from "../../../../../public/images/header_img.png";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 px-5 py-2.5 rounded-full mb-6 shadow-sm">
            <span className="text-indigo-700 font-semibold text-sm sm:text-base">About Us</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-slate-800 via-slate-700 to-indigo-800 bg-clip-text text-transparent mb-6 leading-tight">
            Our Story
          </h1>
          <p className="text-slate-600 max-w-3xl mx-auto text-base sm:text-lg lg:text-xl leading-relaxed">
            Discover who we are, what drives us, and how we’re redefining beauty with premium products crafted with passion and care.
          </p>
        </div>

        {/* Our Story Section */}
        <section className="mb-16 lg:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Who We Are</h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                Founded in 2020, we are more than just an e-commerce brand — we are a movement dedicated to empowering confidence through exceptional beauty products.
              </p>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                From luxurious skincare to vibrant makeup, every product is thoughtfully crafted using premium, ethically sourced ingredients. We believe beauty should be inclusive, sustainable, and innovative — accessible to everyone who wants to shine.
              </p>
            </div>
            <div className="order-1 lg:order-2 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={abutimage}
                  alt="Our Story - Team and Vision"
                  width={600}
                  height={600}
                  className="w-full h-80 sm:h-96 lg:h-[500px] object-cover transition-transform duration-700 hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="mb-16 lg:mb-28">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-slate-800 to-indigo-700 bg-clip-text text-transparent mb-6">
              Our Mission & Values
            </h2>
            <p className="text-slate-600 max-w-4xl mx-auto text-base sm:text-lg lg:text-xl leading-relaxed">
              To inspire confidence through sustainable, innovative, and inclusive beauty solutions that empower everyone to embrace their unique radiance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: "Sustainability",
                desc: "Eco-friendly packaging, cruelty-free formulas, and responsibly sourced ingredients for a better planet.",
              },
              {
                icon: Heart,
                title: "Inclusivity",
                desc: "Products made for every skin tone, type, and identity — beauty belongs to everyone.",
              },
              {
                icon: Star,
                title: "Innovation",
                desc: "Cutting-edge formulations backed by science to deliver real, visible results you can trust.",
              },
            ].map((item, idx) => (
              <Card
                key={idx}
                className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 hover:border-indigo-200 hover:-translate-y-2 p-5"
              >
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className="w-7 h-7 text-indigo-600" />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-bold text-slate-800">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 text-base leading-relaxed">
                    {item.desc}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Our Team Section */}
        <section className="mb-16 lg:mb-28">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-slate-800 to-indigo-700 bg-clip-text text-transparent mb-6">
              Meet Our Passionate Team
            </h2>
            <p className="text-slate-600 max-w-3xl mx-auto text-base sm:text-lg lg:text-xl">
              Creative minds and beauty enthusiasts working together to bring you products that truly make a difference.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
            {[
              {
                name: "Jane Doe",
                role: "Founder & CEO",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
              },
              {
                name: "Sarah Smith",
                role: "Product Manager",
                image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
              },
              {
                name: "Michael Brown",
                role: "Lead Designer",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
              },
              {
                name: "Emily Johnson",
                role: "Marketing Director",
                image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face",
              },
            ].map((member) => (
              <div
                key={member.name}
                className="group text-center"
              >
                <div className="relative mb-5 overflow-hidden rounded-3xl shadow-lg group-hover:shadow-2xl transition-all duration-500">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={300}
                    height={300}
                    className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-800">{member.name}</h3>
                <p className="text-slate-500 text-sm sm:text-base mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        
      </div>
      {/* Call to Action */}
        <section className="text-center py-12 lg:py-16 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-inner">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-slate-800 to-indigo-700 bg-clip-text text-transparent mb-6">
            Join Our Journey
          </h2>
          <p className="text-slate-700 max-w-2xl mx-auto mb-10 text-base sm:text-lg lg:text-xl leading-relaxed px-4">
            Be part of a community that celebrates beauty in all its forms. Explore our curated collection today.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-10 py-7 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            asChild
          >
            <Link href="/products">Shop Our Collection</Link>
          </Button>
        </section>
    </main>
  );
}