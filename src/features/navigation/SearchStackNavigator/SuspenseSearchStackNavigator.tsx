import React, { lazy, Suspense } from 'react'

import { LoadingPage } from 'ui/pages/LoadingPage'

const LazySearchStackNavigator = lazy(async () => {
  const module = await import('./SearchStackNavigator')
  return { default: module.SearchStackNavigator }
})

export const SuspenseSearchStackNavigator = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <LazySearchStackNavigator />
    </Suspense>
  )
}
