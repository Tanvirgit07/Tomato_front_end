import React from 'react'
// import { BecomeSellerForm } from './_components/BecomeSellerForm'
import BecomASellerHero from './_components/BecomASellerHero'
import SellerBenefits from './_components/SellerBenefits'
import StepToStepSelling from './_components/StepToStepSelling'
import SellerStory from './_components/SellerStory'
import BecomeASellerBtn from './_components/BecomeASellerBtn'

function page() {
  return (
    <div>
      <BecomASellerHero />
      <SellerBenefits />
      <StepToStepSelling />
      <SellerStory />
        {/* <BecomeSellerForm /> */}
        <BecomeASellerBtn />
    </div>
  )
}

export default page