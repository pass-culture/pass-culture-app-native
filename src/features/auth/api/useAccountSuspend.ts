import { useMutation } from '@tanstack/react-query'

import { api } from 'api/api'

export function useAccountSuspend(onSuccess: () => void, onError: (error: unknown) => void) {
  return useMutation(() => api.postnativev1accountsuspend(), {
    onSuccess,
    onError,
  })
}
