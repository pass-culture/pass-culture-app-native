import loadable from '@loadable/component'
import React from 'react'

import { LoadingPage } from 'ui/components/LoadingPage'

export const BeneficiaryRequestSent = loadable(() => import('./BeneficiaryRequestSent'), {
  resolveComponent: (components) => components.BeneficiaryRequestSent,
  fallback: <LoadingPage />,
})
