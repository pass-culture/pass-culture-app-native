import { useMutation } from 'react-query'

import { api } from 'api/api'

type UseAccountSuspendOptions = {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

export function useAccountSuspend({ onSuccess, onError }: UseAccountSuspendOptions = {}) {
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
