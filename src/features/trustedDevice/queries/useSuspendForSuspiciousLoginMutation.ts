import { useMutation } from '@tanstack/react-query'

import { api } from 'api/api'
import { SuspendAccountForSuspiciousLoginRequest } from 'api/gen'

interface MutationOptions {
  onSuccess: () => void
  onError: (error: unknown) => void
}

export const useSuspendForSuspiciousLoginMutation = ({ onSuccess, onError }: MutationOptions) =>
  useMutation({
    mutationFn: (body: SuspendAccountForSuspiciousLoginRequest) =>
      api.postNativeV1AccountSuspendForSuspiciousLogin(body),
    onSuccess,
    onError,
  })
