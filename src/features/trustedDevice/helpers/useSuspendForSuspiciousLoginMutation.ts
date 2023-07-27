import { useMutation } from 'react-query'

import { api } from 'api/api'
import { SuspendAccountForSuspiciousLoginRequest } from 'api/gen'

interface MutationOptions {
  onSuccess: () => void
  onError: (error: unknown) => void
}

export function useSuspendForSuspiciousLoginMutation({ onSuccess, onError }: MutationOptions) {
  return useMutation(
    (body: SuspendAccountForSuspiciousLoginRequest) =>
      api.postnativev1accountsuspendForSuspiciousLogin(body),
    {
      onSuccess,
      onError,
    }
  )
}
