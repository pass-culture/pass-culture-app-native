import { useMutation } from 'react-query'

import { api } from 'api/api'

export function useAccountUnsuspend(onSuccess: () => void, onError: (error: unknown) => void) {
  return useMutation(() => api.postnativev1accountunsuspend(), {
    onSuccess,
    onError,
  })
}
