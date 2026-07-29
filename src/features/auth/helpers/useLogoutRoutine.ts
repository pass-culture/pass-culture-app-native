import { useCallback } from 'react'

import { api } from 'api/api'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { analytics } from 'libs/analytics/provider'
import { clearRefreshToken } from 'libs/keychain/keychain'
import { eventMonitoring } from 'libs/monitoring/services'
import { BatchProfile } from 'libs/react-native-batch'
import { googleLogout } from 'libs/react-native-google-sso/googleLogout'
import { queryClient } from 'libs/react-query/queryClient'
import { storage } from 'libs/storage'

const handleBatchProfileReset = () => {
  BatchProfile.identify(null)
  const editor = BatchProfile.editor()
  editor.setAttribute('app_version', null)
  editor.setAttribute('last_booking_date', null)
  editor.setAttribute('credit_activation_date', null)
  editor.save()
}

export const logoutActions = async (setIsLoggedIn: (isLoggedIn: boolean) => void) => {
  setIsLoggedIn(false)
  try {
    handleBatchProfileReset()
    queryClient.removeQueries({
      predicate: (query) => !!query.meta?.private,
    })

    await Promise.all([
      analytics.logLogout(),
      api.postNativeV1Signout(),
      storage.clear('access_token'),
      clearRefreshToken(),
      googleLogout(),
    ])

    eventMonitoring.setUser(null)
  } catch (err) {
    eventMonitoring.captureException(err)
  }
}

export const useLogoutRoutine = (): (() => Promise<void>) => {
  const { setIsLoggedIn } = useAuthContext()

  return useCallback(async () => logoutActions(setIsLoggedIn), [setIsLoggedIn])
}
