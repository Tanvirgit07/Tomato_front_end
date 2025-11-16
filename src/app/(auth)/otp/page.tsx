import React, { Suspense } from 'react'
import OTPForm from './_components/OTPForm'

function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <OTPForm />
    </Suspense>
  )
}

export default page