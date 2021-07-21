import loadable from '@loadable/component'
import React from 'react'

import { LoadingPage } from 'ui/components/LoadingPage'

export const AppNavigationContainer = loadable(() => import('./NavigationContainer'), {
  resolveComponent: (components) => components.AppNavigationContainer,
  fallback: <LoadingPage />,
})
