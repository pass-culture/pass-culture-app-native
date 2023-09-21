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
      api.postNativeV1AccountSuspendForSuspiciousLogin(body),
    {
      onSuccess,
      onError,
    }
  )
}
