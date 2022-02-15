import { t } from '@lingui/macro'
import { useNetInfo } from '@react-native-community/netinfo'
import { useEffect } from 'react'

import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export function NetInfoWrapper({ children }: { children: JSX.Element }) {
  // use the raw useNetInfo here which is null at start
  const networkInfo = useNetInfo()
  const { showInfoSnackBar } = useSnackBarContext()

  useEffect(() => {
    if (networkInfo.isConnected === false) {
      showInfoSnackBar({
        message: t`Aucune connexion internet. Réessaie plus tard`,
        timeout: SNACK_BAR_TIME_OUT,
      })
    }
  }, [networkInfo.isConnected])

  return children
}
