import loadable from '@loadable/component'
import React from 'react'

import { LoadingPage } from 'ui/components/LoadingPage'

export const ABTestingPOC = loadable(() => import('./ABTestingPOC'), {
  resolveComponent: (components) => components.ABTestingPOC,
  fallback: <LoadingPage />,
})
