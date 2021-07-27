import loadable from '@loadable/component'
import React from 'react'

import { LoadingPage } from 'ui/components/LoadingPage'

export const LegalNotices = loadable(() => import('./LegalNotices'), {
  resolveComponent: (components) => components.LegalNotices,
  fallback: <LoadingPage />,
})
