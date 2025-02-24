import React, { lazy, Suspense } from 'react'

import { SearchView } from 'features/search/types'
import { LoadingPage } from 'ui/pages/LoadingPage'

const LazySearchStackNavigator = lazy(async () => {
  const module = await import('./SearchStackNavigator')
  return { default: module.SearchStackNavigator }
})

export const SuspenseSearchStackNavigator = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <LazySearchStackNavigator initialRouteName={SearchView.Landing} />
    </Suspense>
  )
}
