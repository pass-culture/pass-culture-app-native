import loadable from '@loadable/component'
import React from 'react'

import { LoadingPage } from 'ui/components/LoadingPage'

export const ChangePassword = loadable(() => import('./ChangePassword'), {
  resolveComponent: (components) => components.ChangePassword,
  fallback: <LoadingPage />,
})
