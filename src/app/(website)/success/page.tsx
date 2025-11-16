import React, { Suspense } from 'react'
import Success from './_components/Success'

function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <Success />
    </Suspense>
  )
}

export default page