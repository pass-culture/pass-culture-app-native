import AsyncStorage from '@react-native-async-storage/async-storage'
import { useCallback } from 'react'
import { useQueryClient } from 'react-query'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { analytics } from 'libs/firebase/analytics'
import { clearRefreshToken } from 'libs/keychain'
import { eventMonitoring } from 'libs/monitoring'
import { QueryKeys } from 'libs/queryKeys'
import { BatchUser } from 'libs/react-native-batch'
import { storage } from 'libs/storage'

export function useLogoutRoutine(): () => Promise<void> {
  const queryClient = useQueryClient()
  const { setIsLoggedIn } = useAuthContext()

  return useCallback(async () => {
    try {
      BatchUser.editor().setIdentifier(null).save()
      analytics.logLogout()
      await storage.clear('access_token')
      await clearRefreshToken()
      LoggedInQueryKeys.forEach((queryKey) => {
        queryClient.removeQueries([queryKey])
      })
      await AsyncStorage.multiRemove(LoggedInQueryKeys)
    } catch (err) {
      eventMonitoring.captureException(err)
    } finally {
      setIsLoggedIn(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setIsLoggedIn])
}

// List of keys that are accessible only when logged in to clean when logging out
export const LoggedInQueryKeys: QueryKeys[] = [
  QueryKeys.BOOKINGS,
  QueryKeys.CULTURAL_SURVEY_QUESTIONS,
  QueryKeys.FAVORITES,
  QueryKeys.FAVORITES_COUNT,
  QueryKeys.RECOMMENDATION_HITS,
  QueryKeys.RECOMMENDATION_OFFER_IDS,
  QueryKeys.REPORTED_OFFERS,
  QueryKeys.REPORT_OFFER_REASONS,
  QueryKeys.NEXT_SUBSCRIPTION_STEP,
  QueryKeys.USER_PROFILE,
]
