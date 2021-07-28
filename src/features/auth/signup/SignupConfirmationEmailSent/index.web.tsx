import loadable from '@loadable/component'
import React from 'react'

import { LoadingPage } from 'ui/components/LoadingPage'

export const SignupConfirmationEmailSent = loadable(() => import('./SignupConfirmationEmailSent'), {
  resolveComponent: (components) => components.SignupConfirmationEmailSent,
  fallback: <LoadingPage />,
})
