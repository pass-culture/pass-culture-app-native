import loadable from '@loadable/component'
import React from 'react'

import { LoadingPage } from 'ui/components/LoadingPage'

export const SignupConfirmationExpiredLink = loadable(
  () => import('./SignupConfirmationExpiredLink'),
  {
    resolveComponent: (components) => components.SignupConfirmationExpiredLink,
    fallback: <LoadingPage />,
  }
)
