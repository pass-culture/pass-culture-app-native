import React, { PropsWithChildren } from 'react'

import { AnalyticsDebuggerModal } from 'features/analyticsDebugger/components/AnalyticsDebuggerModal'
import { env } from 'libs/environment/env'

// There is no multi-touch gesture on web: the debugger overlay is opened from the cheatcodes
// screen or the deeplink cheatcodes/other/analytics-debugger.
export const AnalyticsDebugger = ({ children }: PropsWithChildren) => {
  if (!env.ANALYTICS_DEBUGGER_ENABLED) return <React.Fragment>{children}</React.Fragment>
  return (
    <React.Fragment>
      {children}
      <AnalyticsDebuggerModal />
    </React.Fragment>
  )
}
