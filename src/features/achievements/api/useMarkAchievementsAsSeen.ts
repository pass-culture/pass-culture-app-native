import { useMutation, useQueryClient } from 'react-query'

import { api } from 'api/api'
import { QueryKeys } from 'libs/queryKeys'

export function useAchievementsMarkAsSeen(
  onSuccess?: () => void,
  onError?: (error: unknown) => void
) {
  const queryClient = useQueryClient()

  return useMutation(
    (achievementIds: number[]) => api.postNativeV1AchievementsMarkAsSeen({ achievementIds }),
    {
      onSuccess: () => {
        queriesToInvalidateOnMarkAsSeen.forEach((queryKey) =>
          queryClient.invalidateQueries([queryKey])
        )
        if (onSuccess) onSuccess()
      },
      onError,
    }
  )
}

const queriesToInvalidateOnMarkAsSeen: QueryKeys[] = [QueryKeys.USER_PROFILE] // To re-fetch the user's achievements
