import React, { lazy, Suspense } from 'react'

import { LoadingPage } from 'ui/pages/LoadingPage'

const LazyActivationStackNavigator = lazy(async () => {
  const module = await import('./ActivationStackNavigator')
  return { default: module.ActivationStackNavigator }
})

export const SuspenseActivationStackNavigator = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <LazyActivationStackNavigator />
    </Suspense>
  )
}
