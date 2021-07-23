import loadable from '@loadable/component'
import React from 'react'

import { LoadingPage } from 'ui/components/LoadingPage'

export const SetPassword = loadable(() => import('./SetPassword'), {
  resolveComponent: (components) => components.SetPassword,
  fallback: <LoadingPage />,
})
