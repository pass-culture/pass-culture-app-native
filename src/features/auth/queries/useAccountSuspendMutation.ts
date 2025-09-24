import { useMutation } from '@tanstack/react-query'

import { api } from 'api/api'

type UseAccountSuspendMutationOptions = {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

export const useAccountSuspendMutation = ({
  onSuccess,
  onError,
}: UseAccountSuspendMutationOptions = {}) => {
  const { mutate: suspendAccount, isPending } = useMutation({
    mutationFn: () => api.postNativeV1AccountSuspend(),
    onSuccess,
    onError,
  })
  return {
    suspendAccount,
    isLoading: isPending,
  }
}
