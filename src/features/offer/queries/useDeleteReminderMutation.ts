import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from 'api/api'
import { GetRemindersResponse } from 'api/gen'
import { MutationOptions, RemindersMutationOnErrorArgs } from 'features/offer/queries/types'
import { QueryKeys } from 'libs/queryKeys'

export const useDeleteReminderMutation = (options?: MutationOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (reminder_id: number) => api.deleteNativeV1MeRemindersreminderId(reminder_id),

    /* 
      This step is necessary otherwise we get two renders of the CTA with the first one beeing outdated
      since the cache is not up to date yet 
    */
    onMutate: async (reminder_id) => {
      await queryClient.cancelQueries({
        queryKey: [QueryKeys.REMINDERS],
      })
      const previousReminders = queryClient.getQueryData<GetRemindersResponse>([
        QueryKeys.REMINDERS,
      ])

      if (reminder_id) {
        const reminders = previousReminders?.reminders.filter(
          (reminder) => reminder.id !== reminder_id
        )
        if (reminders)
          queryClient.setQueryData<GetRemindersResponse>([QueryKeys.REMINDERS], {
            reminders,
          })
      }
      return {
        previousReminders,
      }
    },

    onError: (args: RemindersMutationOnErrorArgs) => {
      const { context, error } = args
      queryClient.setQueryData([QueryKeys.REMINDERS], context?.previousReminders)
      options?.onError?.(error)
    },

    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.REMINDERS],
      }),
  })
}
