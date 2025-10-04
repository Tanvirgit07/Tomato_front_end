import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BoyRequestModal } from "@/components/modal/BoyRequestModal";

const BecomABoyHero = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600">
      {/* Overlay pattern */}
      <div className="absolute inset-0 bg-[url('https://www.toptal.com/designers/subtlepatterns/uploads/dot-grid.png')] opacity-20"></div>

      <div className="relative z-10 w-full container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 px-6 lg:px-12 items-center">
        {/* Left Side - Content */}
        <div className="text-white space-y-8">
          {/* Tagline */}
          <span className="px-4 py-1 rounded-full text-sm font-semibold tracking-wide bg-white/20 backdrop-blur-md shadow">
            Become a Trusted Seller
          </span>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
            Grow Your <span className="text-yellow-300">Business</span>
            <br />
            With <span className="text-white">Us!</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-orange-100 max-w-lg">
            Join thousands of sellers already earning more by showcasing their
            products to a wider audience. Fast approval, easy setup, and
            reliable support.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4">
            {/* <Button
              size="lg"
              className="bg-white text-orange-600 font-semibold hover:bg-orange-100 rounded-full shadow-lg"
            >
              Start Selling
            </Button> */}
            <BoyRequestModal />
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-red-600 font-semibold hover:bg-white hover:text-orange-600 rounded-full"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="flex items-center justify-center">
          <div className="relative w-full max-w-3xl">
            {" "}
            {/* increased from 2xl to 3xl */}
            <Image
              width={700} // bigger width
              height={700} // bigger height
              src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Warehouse worker with boxes"
              className="rounded-2xl shadow-2xl border-4 border-white/40"
            />
            {/* Decorative Circles */}
            <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-yellow-400 rounded-full blur-2xl opacity-60"></div>
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-pink-500 rounded-full blur-3xl opacity-40"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomABoyHero;
