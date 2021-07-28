import loadable from '@loadable/component'
import React from 'react'

import { LoadingPage } from 'ui/components/LoadingPage'

export const CheatCodes = loadable(() => import('./CheatCodes'), {
  resolveComponent: (components) => components.CheatCodes,
  fallback: <LoadingPage />,
})
