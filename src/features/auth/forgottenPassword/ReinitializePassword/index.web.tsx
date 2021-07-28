import loadable from '@loadable/component'
import React from 'react'

import { LoadingPage } from 'ui/components/LoadingPage'

export const ReinitializePassword = loadable(() => import('./ReinitializePassword'), {
  resolveComponent: (components) => components.ReinitializePassword,
  fallback: <LoadingPage />,
})
