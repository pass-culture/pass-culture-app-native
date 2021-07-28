import loadable from '@loadable/component'
import React from 'react'

import { LoadingPage } from 'ui/components/LoadingPage'

export const ForgottenPassword = loadable(() => import('./ForgottenPassword'), {
  resolveComponent: (components) => components.ForgottenPassword,
  fallback: <LoadingPage />,
})
