import { useMutation } from '@tanstack/react-query'

import { api } from 'api/api'

type UseAccountSuspendForHackSuspicion = {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

export const useAccountSuspendForHackSuspicionMutation = ({
  onSuccess,
  onError,
}: UseAccountSuspendForHackSuspicion = {}) => {
  const { mutate: accountSuspendForHackSuspicion, isPending } = useMutation({
    mutationFn: () => api.postNativeV1AccountSuspendForHackSuspicion(),
    onSuccess,
    onError,
  })
  return {
    accountSuspendForHackSuspicion,
    isLoading: isPending,
  }
}
