import { useMutation } from '@tanstack/react-query'

import { api } from 'api/api'

export const useLogOutMutation = (onSuccess?: () => void, onError?: (error: unknown) => void) =>
  useMutation({
    mutationFn: () => api.postNativeV1Signout(),
    onSuccess,
    onError,
  })
