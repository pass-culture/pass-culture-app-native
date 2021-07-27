import loadable from '@loadable/component'
import React from 'react'

import { LoadingPage } from 'ui/components/LoadingPage'

export const AccountCreated = loadable(() => import('./AccountCreated'), {
  resolveComponent: (components) => components.AccountCreated,
  fallback: <LoadingPage />,
})
