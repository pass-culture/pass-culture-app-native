import loadable from '@loadable/component'
import React from 'react'

import { LoadingPage } from 'ui/components/LoadingPage'

export const NextBeneficiaryStep = loadable(() => import('./NextBeneficiaryStep'), {
  resolveComponent: (components) => components.NextBeneficiaryStep,
  fallback: <LoadingPage />,
})
