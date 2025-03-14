import React, { lazy, Suspense } from 'react'

import { LoadingPage } from 'ui/pages/LoadingPage'

const LazyProfileStackNavigator = lazy(async () => {
  const module = await import('./ProfileStackNavigator')
  return { default: module.ProfileStackNavigator }
})

export const SuspenseProfileStackNavigator = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <LazyProfileStackNavigator />
    </Suspense>
  )
}
