import React from 'react'

import { firebaseAnalytics } from 'libs/firebase/analytics/analytics'

export const AnalyticsInitializer = ({ children }: { children: React.JSX.Element }) => {
  firebaseAnalytics.useInit()

  return children
}
