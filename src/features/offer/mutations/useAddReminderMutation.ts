import { useMutation } from 'react-query'

import { api } from 'api/api'
import { MutationOptions } from 'features/offer/mutations/types'
import { QueryKeys } from 'libs/queryKeys'
import { queryClient } from 'libs/react-query/queryClient'

export const useAddReminderMutation = (options?: MutationOptions) =>
  useMutation((offerId: number) => api.postNativeV1MeReminders({ offerId }), {
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.REMINDERS)
      options?.onSuccess?.()
    },
  })
