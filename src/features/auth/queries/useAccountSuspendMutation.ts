import { useMutation } from '@tanstack/react-query'

import { api } from 'api/api'

type UseAccountSuspendMutationOptions = {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

export function useAccountSuspendMutation({
  onSuccess,
  onError,
}: UseAccountSuspendMutationOptions = {}) {
  const { mutate: suspendAccount, isLoading } = useMutation(
    () => api.postNativeV1AccountSuspend(),
    {
      onSuccess,
      onError,
    }
  )
  return {
    suspendAccount,
    isLoading,
  }
}
