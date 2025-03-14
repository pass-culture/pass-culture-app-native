import React, { lazy, Suspense } from 'react'

import { LoadingPage } from 'ui/pages/LoadingPage'

// This dynamic import allows us to separate all the achievements illustrations (1,06 MB) from the main web bundle.
const LazyAchievements = lazy(async () => {
  const module = await import('features/achievements/pages/Achievements')
  return { default: module.Achievements }
})

export const SuspenseAchievements = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <LazyAchievements />
    </Suspense>
  )
}
