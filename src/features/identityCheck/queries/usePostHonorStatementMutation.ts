import { MutationOptions, useMutation } from '@tanstack/react-query'

import { api } from 'api/api'

export const usePostHonorStatementMutation = ({ onSuccess, onError }: MutationOptions) =>
  useMutation({
    mutationFn: () => api.postNativeV1SubscriptionHonorStatement(),
    onSuccess,
    onError,
  })
