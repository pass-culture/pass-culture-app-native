import loadable from '@loadable/component'
import React from 'react'

import { LoadingPage } from 'ui/components/LoadingPage'

export const ResetPasswordExpiredLink = loadable(() => import('./ResetPasswordExpiredLink'), {
  resolveComponent: (components) => components.ResetPasswordExpiredLink,
  fallback: <LoadingPage />,
})
