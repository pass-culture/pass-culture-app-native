import { MutationOptions, useMutation } from 'react-query'

import { api } from 'api/api'

export function usePostHonorStatementMutation({ onSuccess, onError }: MutationOptions) {
  return useMutation(() => api.postNativeV1SubscriptionHonorStatement(), {
    onSuccess,
    onError,
  })
}
