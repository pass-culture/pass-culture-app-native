import { useMutation, useQueryClient } from 'react-query'

import { api } from 'api/api'
import { MutationOptions } from 'features/offer/mutations/types'
import { GetReminderResponse, ReminderResponse } from 'features/offer/types'
import { QueryKeys } from 'libs/queryKeys'

export const useDeleteReminderMutation = (options?: MutationOptions) => {
  const queryClient = useQueryClient()

  return useMutation(
    (reminder_id: number) => api.deleteNativeV1MeRemindersreminderId(reminder_id),
    {
      /* 
        This step is necessary otherwise we get two renders of the CTA with the first one beeing outdated
        since the cache is not up to date yet 
      */
      onMutate: async (reminder_id) => {
        await queryClient.cancelQueries([QueryKeys.REMINDERS])
        const previousReminders = queryClient.getQueryData<GetReminderResponse>([
          QueryKeys.REMINDERS,
        ])
        if (reminder_id) {
          const reminders = previousReminders?.reminders.filter(
            (reminder) => reminder.id !== reminder_id
          ) as ReminderResponse[]

          queryClient.setQueryData<GetReminderResponse>([QueryKeys.REMINDERS], {
            reminders,
          })
        }

        return { previousReminders }
      },

      onSuccess: () => {
        queryClient.invalidateQueries(QueryKeys.REMINDERS)
        options?.onSuccess?.()
      },
    }
  )
}
