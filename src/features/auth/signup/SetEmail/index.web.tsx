import loadable from '@loadable/component'
import React from 'react'

import { LoadingPage } from 'ui/components/LoadingPage'

export const SetEmail = loadable(() => import('./SetEmail'), {
  resolveComponent: (components) => components.SetEmail,
  fallback: <LoadingPage />,
})
