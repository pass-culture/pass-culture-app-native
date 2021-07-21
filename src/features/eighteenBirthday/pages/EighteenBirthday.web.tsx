import loadable from '@loadable/component'
import React from 'react'

import { LoadingPage } from 'ui/components/LoadingPage'

export const EighteenBirthday = loadable(() => import('./components/EighteenBirthdayAchievement'), {
  resolveComponent: (components) => components.EighteenBirthdayAchievement,
  fallback: <LoadingPage />,
})
