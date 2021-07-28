import loadable from '@loadable/component'
import React from 'react'

import { LoadingPage } from 'ui/components/LoadingPage'

export const NavigationIdCheckErrors = loadable(() => import('./NavigationIdCheckErrors'), {
  resolveComponent: (components) => components.NavigationIdCheckErrors,
  fallback: <LoadingPage />,
})
