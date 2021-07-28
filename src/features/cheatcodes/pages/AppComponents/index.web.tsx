import loadable from '@loadable/component'
import React from 'react'

import { LoadingPage } from 'ui/components/LoadingPage'

export const AppComponents = loadable(() => import('./AppComponents'), {
  resolveComponent: (components) => components.AppComponents,
  fallback: <LoadingPage />,
})
