import React, { lazy, Suspense } from 'react'

import { LoadingPage } from 'ui/pages/LoadingPage'

const LazySubscriptionStackNavigator = lazy(async () => {
  const module = await import('./SubscriptionStackNavigator')
  return { default: module.SubscriptionStackNavigator }
})

export const SuspenseSubscriptionStackNavigator = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <LazySubscriptionStackNavigator />
    </Suspense>
  )
}
