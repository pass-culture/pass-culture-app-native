import loadable from '@loadable/component'
import React from 'react'

import { LoadingPage } from 'ui/components/LoadingPage'

export const CheatMenu = loadable(() => import('./CheatMenu'), {
  resolveComponent: (components) => components.CheatMenu,
  fallback: <LoadingPage />,
})
