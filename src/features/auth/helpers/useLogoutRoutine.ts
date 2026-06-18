import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { analytics } from 'libs/analytics/provider'
import { clearRefreshToken } from 'libs/keychain/keychain'
import { eventMonitoring } from 'libs/monitoring/services'
import { BatchProfile } from 'libs/react-native-batch'
import { googleLogout } from 'libs/react-native-google-sso/googleLogout'
import { storage } from 'libs/storage'

const handleBatchProfileReset = () => {
  BatchProfile.identify(null)
  const editor = BatchProfile.editor()
  editor.setAttribute('app_version', null)
  editor.setAttribute('last_booking_date', null)
  editor.setAttribute('credit_activation_date', null)
  editor.save()
}

export const logoutActions = async (
  setIsLoggedIn: (isLoggedIn: boolean) => void,
  queryClient: QueryClient
) => {
  try {
    setIsLoggedIn(false)
    handleBatchProfileReset()

    queryClient.removeQueries({
      predicate: (query) => !!query.meta?.private,
    })

    await Promise.all([
      analytics.logLogout(),
      storage.clear('access_token'),
      clearRefreshToken(),
      googleLogout(),
    ])
    eventMonitoring.setUser(null)
  } catch (err) {
    eventMonitoring.captureException(err)
  } finally {
    setIsLoggedIn(false)
  }
}

export const useLogoutRoutine = (): (() => Promise<void>) => {
  const queryClient = useQueryClient()
  const { setIsLoggedIn } = useAuthContext()

  return useCallback(
    async () => logoutActions(setIsLoggedIn, queryClient),
    [queryClient, setIsLoggedIn]
  )
}
