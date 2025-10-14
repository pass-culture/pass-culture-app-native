import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from 'api/api'
import { QueryKeys } from 'libs/queryKeys'

export function useAchievementsMarkAsSeenMutation(
  onSuccess?: () => void,
  onError?: (error: unknown) => void
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (achievementIds: number[]) =>
      api.postNativeV1AchievementsMarkAsSeen({ achievementIds }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.USER_PROFILE],
      }) // To re-fetch the user's achievements

      if (onSuccess) onSuccess()
    },

    onError,
  })
}
