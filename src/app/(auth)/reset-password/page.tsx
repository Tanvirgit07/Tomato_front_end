import React, { Suspense } from 'react'
import ResetPassword from './_components/ResetPassword'

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <ResetPassword />
    </Suspense>
  )
}
