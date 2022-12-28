import { useMutation } from 'react-query'

import { api } from 'api/api'
import { ResetRecreditAmountToShowMutationOptions } from 'features/profile/types'

export function useResetRecreditAmountToShow({
  onSuccess,
  onError,
}: ResetRecreditAmountToShowMutationOptions) {
  return useMutation(() => api.postnativev1resetRecreditAmountToShow(), {
    onSuccess,
    onError,
  })
}
