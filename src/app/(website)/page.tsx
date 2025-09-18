import React from 'react'
import HomeHero from './_components/HomeHero'
import Category from './_components/Category'
import BeseSellingProdct from './_components/BeseSellingProdct'
import NewArrivals from './_components/NewArrivals'
import OfferCard from './_components/OfferCard'
import CustomarReview from './_components/CustomarReview'
import BrandSection from './_components/BrandSection'
import BlogSection from './_components/BlogSection'
import CTASection from './_components/CTASection'
import ContactUs from './_components/ContactUs'
import BecomeSellerSection from './_components/BecomeSeller'

function page() {
  return (
    <div>
        <HomeHero />
        <Category />
        <BeseSellingProdct />
        <NewArrivals />
        <OfferCard />
        <CustomarReview />
        <BecomeSellerSection />
        <BrandSection />
        <ContactUs />
        <CTASection />
        <BlogSection />
        
    </div>
  )
}

export default page