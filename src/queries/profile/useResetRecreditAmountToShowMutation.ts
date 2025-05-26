import { useMutation } from 'react-query'

import { api } from 'api/api'

type ResetRecreditAmountToShowMutationOptions = {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

export function useResetRecreditAmountToShowMutation({
  onSuccess,
  onError,
}: ResetRecreditAmountToShowMutationOptions) {
  return useMutation(() => api.postNativeV1ResetRecreditAmountToShow(), {
    onSuccess,
    onError,
  })
}
