import { useMutation } from '@tanstack/react-query'

import { api } from 'api/api'

type UseAccountSuspendForHackSuspicion = {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

export function useAccountSuspendForHackSuspicionMutation({
  onSuccess,
  onError,
}: UseAccountSuspendForHackSuspicion = {}) {
  const { mutate: accountSuspendForHackSuspicion, isLoading } = useMutation(
    () => api.postNativeV1AccountSuspendForHackSuspicion(),
    {
      onSuccess,
      onError,
    }
  )
  return {
    accountSuspendForHackSuspicion,
    isLoading,
  }
}
