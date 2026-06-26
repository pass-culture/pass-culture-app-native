import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { UserProfileResponse } from 'api/gen'
import { getUserProfileState } from 'features/auth/helpers/getUserProfileState'
import { UserProfile } from 'features/share/types'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_USER_PROFILE = 5 * 60 * 1000

const sanitizeUser = (user: UserProfileResponse): UserProfile => {
  const {
    depositType: _depositType,
    needsToFillCulturalSurvey: _needsToFillCulturalSurvey,
    ...rest
  } = user

  const { statusType, creditType, eligibilityType } = getUserProfileState(user)
  return {
    ...rest,
    subscriptionStatus: user.status?.subscriptionStatus,
    statusType,
    creditType,
    eligibilityType,
  }
}

export const useUserProfileInfoQuery = (isLoggedIn: boolean, options = {}) =>
  useQuery<UserProfileResponse, Error, UserProfile>({
    queryKey: [QueryKeys.USER_PROFILE],
    queryFn: () => api.getNativeV1Me(),
    enabled: isLoggedIn,
    staleTime: STALE_TIME_USER_PROFILE,
    meta: { persist: true, private: true },
    select: sanitizeUser,
    ...options,
  })
