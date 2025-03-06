import { useMutation } from '@tanstack/react-query'

import { api } from 'api/api'

type UseAccountSuspendOptions = {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

export function useAccountSuspend({ onSuccess, onError }: UseAccountSuspendOptions = {}) {
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
