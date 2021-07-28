import loadable from '@loadable/component'
import React from 'react'

import { LoadingPage } from 'ui/components/LoadingPage'

export const ResetPasswordEmailSent = loadable(() => import('./ResetPasswordEmailSent'), {
  resolveComponent: (components) => components.ResetPasswordEmailSent,
  fallback: <LoadingPage />,
})
