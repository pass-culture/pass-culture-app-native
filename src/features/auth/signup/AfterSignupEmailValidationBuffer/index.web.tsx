import loadable from '@loadable/component'
import React from 'react'

import { LoadingPage } from 'ui/components/LoadingPage'

export const AfterSignupEmailValidationBuffer = loadable(
  () => import('./AfterSignupEmailValidationBuffer'),
  {
    resolveComponent: (components) => components.AfterSignupEmailValidationBuffer,
    fallback: <LoadingPage />,
  }
)
