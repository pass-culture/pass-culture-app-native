import React, { FunctionComponent, PropsWithChildren } from 'react'

import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { OfflinePage } from 'libs/network/OfflinePage'

export const OfflineWrapper: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const netInfo = useNetInfoContext()
  return netInfo.isConnected ? <React.Fragment>{children}</React.Fragment> : <OfflinePage />
}
