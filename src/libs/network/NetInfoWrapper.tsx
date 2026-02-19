// eslint-disable-next-line no-restricted-imports
import { NetInfoState, NetInfoStateType } from '@react-native-community/netinfo'
import { onlineManager } from '@tanstack/react-query'
import React, { PropsWithChildren, createContext, memo, useContext, useEffect } from 'react'
import { Platform } from 'react-native'

import { analytics } from 'libs/analytics/provider'
import { useNetInfo } from 'libs/network/useNetInfo'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'

export const NetInfoWrapper = memo(function NetInfoWrapper({ children }: PropsWithChildren) {
  const networkInfo = useNetInfo()

  useEffect(() => {
    if (networkInfo.isConnected === null || networkInfo.isInternetReachable === null) return
    const isConnected = networkInfo.isConnected && networkInfo.isInternetReachable
    onlineManager.setOnline(isConnected)
    if (isConnected === false) {
      showErrorSnackBar('Aucune connexion internet. Réessaie plus tard.')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkInfo.isConnected, networkInfo.isInternetReachable])

  useEffect(() => {
    const connectionType = networkInfo.type
    if (connectionType === NetInfoStateType.unknown) {
      return
    }
    analytics.logConnectionInfo({
      type: connectionType,
      generation:
        connectionType === NetInfoStateType.cellular
          ? networkInfo.details?.cellularGeneration
          : undefined,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkInfo.type])

  return <NetInfoContext.Provider value={networkInfo}>{children}</NetInfoContext.Provider>
})

const isWeb = Platform.OS === 'web'

const NetInfoContext = createContext<NetInfoState>({
  type: NetInfoStateType.unknown,
  isConnected: isWeb ? true : null,
  isInternetReachable: isWeb ? true : null,
  details: null,
} as NetInfoState)

type UseNetInfoContext = (options?: {
  onConnectionLost?: VoidFunction
  onConnection?: VoidFunction
  onInternetConnectionLost?: VoidFunction
  onInternetConnection?: VoidFunction
}) => NetInfoState

export const useNetInfoContext: UseNetInfoContext = ({
  onConnectionLost,
  onConnection,
  onInternetConnectionLost,
  onInternetConnection,
} = {}) => {
  const networkInfo = useContext(NetInfoContext)
  const { isConnected, isInternetReachable } = networkInfo

  useEffect(() => {
    if (isConnected && onConnection) {
      onConnection()
    } else if (!isConnected && onConnectionLost) {
      onConnectionLost()
    }
  }, [isConnected, onConnectionLost, onConnection])

  useEffect(() => {
    if (isInternetReachable && onInternetConnection) {
      onInternetConnection()
    } else if (!isInternetReachable && onInternetConnectionLost) {
      onInternetConnectionLost()
    }
  }, [isInternetReachable, onInternetConnectionLost, onInternetConnection])

  return useContext(NetInfoContext)
}
