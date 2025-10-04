import React from 'react'
import BecomABoyHero from './_components/BecomABoyHero'
import BoyBenefits from './_components/BoyBenefits'
import StepToStepDelivary from './_components/StepToStepDelivary'
import BoyStory from './_components/BoyStory'

function page() {
  return (
    <div>
        <BecomABoyHero />
        <BoyBenefits />
        <StepToStepDelivary />
        <BoyStory />
    </div>
  )
}

export default page