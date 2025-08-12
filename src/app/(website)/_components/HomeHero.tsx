import Image from 'next/image'
import Link from 'next/link'

const HomeHero = () => {
  return (
    <section className="relative h-[400px] sm:h-[500px] lg:h-screen overflow-hidden">
      
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/header_img.png"
          alt="Delicious food background"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/20 sm:bg-black/10"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center h-full">
            
            {/* Text Content */}
            <div className="text-white space-y-6 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Order your <br /> favourite food here
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-lg mx-auto lg:mx-0">
                Choose from a diverse menu featuring a delectable array of dishes crafted with the 
                finest ingredients and culinary expertise. Our mission is to satisfy your cravings 
                and elevate your dining experience, one delicious meal at a time.
              </p>
              
              <div>
                <Link 
                  href="/menu" 
                  className="inline-block bg-white text-orange-500 px-6 py-2.5 sm:px-8 sm:py-3 rounded-full font-semibold hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  View Menu
                </Link>
              </div>
            </div>

            {/* Right Side Empty for BG */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeHero