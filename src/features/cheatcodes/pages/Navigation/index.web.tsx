import loadable from '@loadable/component'
import React from 'react'

import { LoadingPage } from 'ui/components/LoadingPage'

export const Navigation = loadable(() => import('./Navigation'), {
  resolveComponent: (components) => components.Navigation,
  fallback: <LoadingPage />,
})
