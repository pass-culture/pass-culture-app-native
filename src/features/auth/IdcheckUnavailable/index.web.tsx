import loadable from '@loadable/component'
import React from 'react'

import { LoadingPage } from 'ui/components/LoadingPage'

export const IdCheckUnavailable = loadable(() => import('./IdCheckUnavailable'), {
  resolveComponent: (components) => components.IdCheckUnavailable,
  fallback: <LoadingPage />,
})
