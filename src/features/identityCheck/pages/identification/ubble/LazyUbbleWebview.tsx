import React, { Suspense, lazy } from 'react'

import { LoadingPage } from 'ui/pages/LoadingPage'

const UbbleWebview = lazy(() => import('./UbbleWebview').then(module => ({ default: module.UbbleWebview })))

export const LazyUbbleWebview: React.FC = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <UbbleWebview />
    </Suspense>
  )
}