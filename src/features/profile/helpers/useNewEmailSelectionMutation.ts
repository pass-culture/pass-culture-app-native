import { useMutation } from '@tanstack/react-query'

import { api } from 'api/api'
import { NewEmailSelectionRequest } from 'api/gen'

export const useNewEmailSelectionMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void
  onError: () => void
}) => {
  return useMutation(
    (body: NewEmailSelectionRequest) => api.postNativeV2ProfileEmailUpdateNewEmail(body),
    { onSuccess, onError }
  )
}
