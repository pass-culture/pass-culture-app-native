import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { UserProfileResponse } from 'api/gen'
import { getUserProfileState } from 'features/auth/helpers/getUserProfileState'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_USER_PROFILE = 5 * 60 * 1000

const sanitizeUser = (user: UserProfileResponse): UserProfileResponseWithoutSurvey => {
  const {
    depositType: _depositType,
    needsToFillCulturalSurvey: _needsToFillCulturalSurvey,
    ...rest
  } = user

  const { statusType, creditType, eligibilityType } = getUserProfileState(user)

  return {
    ...rest,
    statusType,
    creditType,
    eligibilityType,
  }
}

export const useUserProfileInfoQuery = (isLoggedIn: boolean, options = {}) => {
  const netInfo = useNetInfoContext()

  return useQuery<UserProfileResponse, Error, UserProfileResponseWithoutSurvey>({
    queryKey: [QueryKeys.USER_PROFILE],
    queryFn: () => api.getNativeV1Me(),
    enabled: !!netInfo.isConnected && isLoggedIn,
    staleTime: STALE_TIME_USER_PROFILE,
    meta: { persist: true },
    select: sanitizeUser,
    ...options,
  })
}
