import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { UserProfileResponse } from 'api/gen'
import { getLastLoginInfo } from 'features/auth/helpers/getLastLoginInfo'
import { getUserProfileState } from 'features/auth/helpers/getUserProfileState'
import { saveLastLoginInfo } from 'features/auth/helpers/saveLastLoginInfo'
import { Provider } from 'features/auth/types'
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

const saveLoginInfo = async (user: UserProfileResponse) => {
  const info = await getLastLoginInfo()
  const provider = info ? info.provider.type : Provider.EMAIL
  await saveLastLoginInfo({
    email: user.email,
    provider,
  })
}

const getUserProfile = async () => {
  const user = await api.getNativeV1Me()
  await saveLoginInfo(user).catch(() => {})
  return user
}

export const useUserProfileInfoQuery = (isLoggedIn: boolean, options = {}) =>
  useQuery<UserProfileResponse, Error, UserProfile>({
    queryKey: [QueryKeys.USER_PROFILE],
    queryFn: getUserProfile,
    enabled: isLoggedIn,
    staleTime: STALE_TIME_USER_PROFILE,
    meta: { persist: true, private: true },
    select: sanitizeUser,
    ...options,
  })
