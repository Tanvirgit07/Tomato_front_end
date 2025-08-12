import React from 'react'
import HomeHero from './_components/HomeHero'
import Category from './_components/Category'
import BeseSellingProdct from './_components/BeseSellingProdct'
import NewArrivals from './_components/NewArrivals'
import OfferCard from './_components/OfferCard'

function page() {
  return (
    <div>
        <HomeHero />
        <Category />
        <BeseSellingProdct />
        <NewArrivals />
        <OfferCard />
    </div>
  )
}

export default page