import { useMutation } from 'react-query'

import { api } from 'api/api'

export function useAccountSuspend(onSuccess: () => void, onError: (error: unknown) => void) {
  return useMutation(() => api.postNativeV1AccountSuspend(), {
    onSuccess,
    onError,
  })
}
