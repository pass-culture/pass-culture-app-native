import { t } from '@lingui/macro'
// eslint-disable-next-line no-restricted-imports
import { NetInfoState, NetInfoStateType } from '@react-native-community/netinfo'
import React, { createContext, memo, useContext, useEffect } from 'react'
import { Platform } from 'react-native'

import { useNetInfo } from 'libs/network/useNetInfo'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export const NetInfoWrapper = memo(function NetInfoWrapper({
  children,
}: {
  children: JSX.Element
}) {
  const networkInfo = useNetInfo()
  const { showInfoSnackBar } = useSnackBarContext()

  useEffect(() => {
    if (networkInfo.isConnected === false) {
      showInfoSnackBar({
        message: t`Aucune connexion internet. Réessaie plus tard`,
        timeout: SNACK_BAR_TIME_OUT,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkInfo.isConnected])

  return <NetInfoContext.Provider value={networkInfo}>{children}</NetInfoContext.Provider>
})

const isWeb = Platform.OS === 'web'

const NetInfoContext = createContext<NetInfoState>({
  type: NetInfoStateType.unknown,
  isConnected: isWeb ? true : null,
  isInternetReachable: isWeb ? true : null,
  details: null,
} as NetInfoState)

export function useNetInfoContext(): NetInfoState {
  return useContext(NetInfoContext)
}
