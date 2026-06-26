import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from 'api/api'

export const useAccountUnsuspendMutation = (
  onSuccess: () => void,
  onError: (error: unknown) => void
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => api.postNativeV1AccountUnsuspend(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        predicate: (query) => !!query.meta?.private,
      })
      onSuccess()
    },
    onError,
  })
}
