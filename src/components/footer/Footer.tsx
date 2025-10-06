'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter subscription submitted');
  };



  

  return (
    <footer className="bg-gray-900 text-gray-200 py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">ShopElite</span>
              <svg className="w-8 h-8 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4-8h-3v3c0 .55-.45 1-1 1s-1-.45-1-1v-3H8c-.55 0-1-.45-1-1s.45-1 1-1h3V7c0-.55.45-1 1-1s1 .45 1 1v3h3c.55 0 1 .45 1 1s-.45 1-1 1z" />
              </svg>
            </Link>
            <p className="text-sm text-gray-400 max-w-xs">
              Discover quality products and exceptional service at ShopElite. Your one-stop shop for all your needs.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                <Facebook className="w-5 h-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                <Instagram className="w-5 h-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                <Linkedin className="w-5 h-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-blue-400 transition-colors">
                  Shop All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-blue-400 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-blue-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/returns" className="hover:text-blue-400 transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-blue-400 transition-colors">
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Get in Touch</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>123 Commerce St, Online City, EC 12345</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <a href="tel:+1234567890" className="hover:text-blue-400 transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <a href="mailto:support@shopelite.com" className="hover:text-blue-400 transition-colors">
                  support@shopelite.com
                </a>
              </li>
            </ul>
            <div className="pt-4">
              <h4 className="text-sm font-semibold text-white mb-2">Stay Updated</h4>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Send className="w-4 h-4" />
                  <span className="sr-only">Subscribe</span>
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 md:mt-12 pt-6 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} ShopElite. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;