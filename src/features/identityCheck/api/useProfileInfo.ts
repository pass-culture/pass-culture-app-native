import { useQuery } from 'react-query'

import { api } from 'api/api'
import { RehydrationProfile } from 'features/identityCheck/types'
import { QueryKeys } from 'libs/queryKeys'

async function getProfileInfo() {
  try {
    return await api.getNativeV1SubscriptionProfile()
  } catch {
    return null
  }
}

export const useProfileInfo = (): {
  profileInfo: RehydrationProfile | null
} => {
  const { data } = useQuery([QueryKeys.SUBSCRIPTION_PROFILE_INFO], () => getProfileInfo())

  if (data) {
    return { profileInfo: data.profile }
  }

  return { profileInfo: null }
}
