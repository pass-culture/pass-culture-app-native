import { useMutation } from 'react-query'

import { api } from 'api/api'
import { MutationOptions } from 'features/identityCheck/api/types'

export function usePostHonorStatement({ onSuccess, onError }: MutationOptions) {
  return useMutation(() => api.postNativeV1SubscriptionHonorStatement(), {
    onSuccess,
    onError,
  })
}
