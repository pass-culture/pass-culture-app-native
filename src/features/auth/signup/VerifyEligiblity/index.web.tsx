import loadable from '@loadable/component'
import React from 'react'

import { LoadingPage } from 'ui/components/LoadingPage'

export const VerifyEligibility = loadable(() => import('./VerifyEligibility'), {
  resolveComponent: (components) => components.VerifyEligibility,
  fallback: <LoadingPage />,
})
