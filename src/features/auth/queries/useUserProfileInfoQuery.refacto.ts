import { useQuery } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'

import { UserProfileResponse } from 'api/gen'
import { getNativeV1Me } from 'api/v2/requests'
import { getUserProfileState } from 'features/auth/helpers/getUserProfileState'
import { UserProfile } from 'features/share/types'
import { QueryKeys } from 'libs/queryKeys'
import { queryClient } from 'libs/react-query/queryClient'

const profileInfoQueryBaseOptions = {
  queryKey: [QueryKeys.USER_PROFILE],
  queryFn: () => getNativeV1Me(),
  staleTime: 23 * 60 * 60 * 1000,
  gcTime: 24 * 60 * 60 * 1000,
}

const sanitizeUser = (userProfileInfoResponse: AxiosResponse<UserProfileResponse>): UserProfile => {
  const { data: user } = userProfileInfoResponse
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
  useQuery<AxiosResponse<UserProfileResponse>, Error, UserProfile>({
    enabled: isLoggedIn,
    meta: { persist: true, private: true },
    select: sanitizeUser,
    ...profileInfoQueryBaseOptions,
    ...options,
  })

export const prefetchProfileInfoQuery = async () =>
  queryClient.prefetchQuery({
    ...profileInfoQueryBaseOptions,
  })
