import Image from "next/image";
import { Button } from "@/components/ui/button";

const BecomASellerHero = () => {
  return (
    <section className="relative min-h-[80vh] md:min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 overflow-hidden">
      {/* Subtle Dot Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.toptal.com/designers/subtlepatterns/uploads/dot-grid.png')] opacity-20"></div>

      <div className="relative z-10 w-full container mx-auto px-6 sm:px-8 lg:px-12 py-12 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left Side - Content (Mobile এ উপরে আসবে) */}
          <div className="text-white space-y-8 lg:space-y-10 order-2 lg:order-1">
            {/* Tagline Badge */}
            <span className="inline-block px-5 py-2 rounded-full text-sm sm:text-base font-semibold tracking-wide bg-white/20 backdrop-blur-md shadow-lg">
              Become a Trusted Seller
            </span>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight drop-shadow-2xl">
              Grow Your <span className="text-yellow-300">Business</span>
              <br className="hidden sm:block" />
              With <span className="text-white">Us!</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg md:text-xl text-orange-100 max-w-xl leading-relaxed">
              Join thousands of sellers already earning more by showcasing their
              products to a wider audience. Fast approval, easy setup, and
              reliable support — everything you need to succeed.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-4">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-orange-600 font-bold hover:bg-orange-50 rounded-full shadow-xl hover:shadow-2xl text-base sm:text-lg px-8 py-6 transition-all duration-300"
              >
                Start Selling Today
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-white text-white text-black font-bold hover:bg-white hover:text-orange-600 rounded-full shadow-xl hover:shadow-2xl text-base sm:text-lg px-8 py-6 transition-all duration-300"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Side - Image (Mobile এ নিচে আসবে) */}
          <div className="flex items-center justify-center order-1 lg:order-2">
            <div className="relative w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl">
              <Image
                src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Warehouse worker managing products - Become a seller"
                width={800}
                height={800}
                className="rounded-2xl sm:rounded-3xl shadow-2xl border-4 sm:border-8 border-white/40 object-cover w-full h-auto"
                priority
              />

              {/* Decorative Blur Circles */}
              <div className="absolute -bottom-4 sm:-bottom-8 -left-4 sm:-left-8 w-24 sm:w-32 md:w-40 h-24 sm:h-32 md:h-40 bg-yellow-400 rounded-full blur-2xl sm:blur-3xl opacity-60"></div>
              <div className="absolute -top-6 sm:-top-10 -right-6 sm:-right-10 w-32 sm:w-44 md:w-56 h-32 sm:h-44 md:h-56 bg-pink-500 rounded-full blur-3xl opacity-50"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 bg-orange-300 rounded-full blur-3xl opacity-30 -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomASellerHero;