import { useQuery } from '@tanstack/react-query'

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

export const useProfileInfoQuery = (): {
  profileInfo: RehydrationProfile | null
} => {
  const { data } = useQuery({
    queryKey: [QueryKeys.SUBSCRIPTION_PROFILE_INFO],
    queryFn: () => getProfileInfo(),
  })

  return { profileInfo: data?.profile ?? null }
}
