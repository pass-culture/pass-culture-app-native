import AsyncStorage from '@react-native-async-storage/async-storage'
import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { analytics } from 'libs/analytics/provider'
import { clearRefreshToken } from 'libs/keychain/keychain'
import { eventMonitoring } from 'libs/monitoring/services'
import { QueryKeys } from 'libs/queryKeys'
import { BatchProfile } from 'libs/react-native-batch'
import { googleLogout } from 'libs/react-native-google-sso/googleLogout'
import { storage } from 'libs/storage'

export function useLogoutRoutine(): () => Promise<void> {
  const queryClient = useQueryClient()
  const { setIsLoggedIn } = useAuthContext()

  return useCallback(async () => {
    try {
      handleBatchProfileReset()

      LoggedInQueryKeys.forEach((queryKey) => {
        queryClient.removeQueries([queryKey])
      })
      await Promise.all([
        analytics.logLogout(),
        storage.clear('access_token'),
        clearRefreshToken(),
        AsyncStorage.multiRemove(LoggedInQueryKeys),
        googleLogout(),
      ])
      eventMonitoring.setUser(null)
    } catch (err) {
      eventMonitoring.captureException(err)
    } finally {
      setIsLoggedIn(false)
    }
  }, [queryClient, setIsLoggedIn])
}

function handleBatchProfileReset() {
  BatchProfile.identify(null)
  const editor = BatchProfile.editor()
  editor.setAttribute('app_version', null)
  editor.setAttribute('last_booking_date', null)
  editor.setAttribute('credit_activation_date', null)
  editor.save()
}

// List of keys that are accessible only when logged in to clean when logging out
export const LoggedInQueryKeys: QueryKeys[] = [
  QueryKeys.BOOKINGS,
  QueryKeys.CULTURAL_SURVEY_QUESTIONS,
  QueryKeys.FAVORITES,
  QueryKeys.FAVORITES_COUNT,
  QueryKeys.RECOMMENDATION_HITS,
  QueryKeys.RECOMMENDATION_OFFER_IDS,
  QueryKeys.NEXT_SUBSCRIPTION_STEP,
  QueryKeys.USER_PROFILE,
]
