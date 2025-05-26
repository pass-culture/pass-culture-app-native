import React, { lazy, Suspense } from 'react'

import { LoadingPage } from 'ui/pages/LoadingPage'

const LazyOnboardingStackNavigator = lazy(async () => {
  const module = await import('./OnboardingStackNavigator')
  return { default: module.OnboardingStackNavigator }
})

export const SuspenseOnboardingStackNavigator = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <LazyOnboardingStackNavigator />
    </Suspense>
  )
}
