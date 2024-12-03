import { useQuery } from 'react-query'

import { api } from 'api/api'
import { RehydrationProfile } from 'features/identityCheck/types'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
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
  const netInfo = useNetInfoContext()

  const { data } = useQuery([QueryKeys.SUBSCRIPTION_PROFILE_INFO], () => getProfileInfo(), {
    enabled: !!netInfo.isConnected && !!netInfo.isInternetReachable,
  })

  if (data) {
    // @ts-expect-error: because of noUncheckedIndexedAccess
    return { profileInfo: data.profile }
  }

  return { profileInfo: null }
}
