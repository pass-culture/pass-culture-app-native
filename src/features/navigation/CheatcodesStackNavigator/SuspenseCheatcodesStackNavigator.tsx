import React, { lazy, Suspense } from 'react'

import { LoadingPage } from 'ui/pages/LoadingPage'

const LazyCheatcodesStackNavigator = lazy(async () => {
  const module = await import(
    'features/navigation/CheatcodesStackNavigator/CheatcodesStackNavigator'
  )
  return { default: module.CheatcodesStackNavigator }
})

export const SuspenseCheatcodesStackNavigator = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <LazyCheatcodesStackNavigator />
    </Suspense>
  )
}
