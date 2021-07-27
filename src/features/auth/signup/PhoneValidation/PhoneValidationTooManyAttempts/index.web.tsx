import loadable from '@loadable/component'
import React from 'react'

import { LoadingPage } from 'ui/components/LoadingPage'

export const PhoneValidationTooManyAttempts = loadable(
  () => import('./PhoneValidationTooManyAttempts'),
  {
    resolveComponent: (components) => components.PhoneValidationTooManyAttempts,
    fallback: <LoadingPage />,
  }
)
