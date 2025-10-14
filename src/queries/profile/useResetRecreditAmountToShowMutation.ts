import { useMutation } from '@tanstack/react-query'

import { api } from 'api/api'

type ResetRecreditAmountToShowMutationOptions = {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

export const useResetRecreditAmountToShowMutation = ({
  onSuccess,
  onError,
}: ResetRecreditAmountToShowMutationOptions) =>
  useMutation({
    mutationFn: () => api.postNativeV1ResetRecreditAmountToShow(),
    onSuccess,
    onError,
  })
