import loadable from '@loadable/component'
import React from 'react'

import { LoadingPage } from 'ui/components/LoadingPage'

export const SetBirthday = loadable(() => import('./SetBirthday'), {
  resolveComponent: (components) => components.SetBirthday,
  fallback: <LoadingPage />,
})
