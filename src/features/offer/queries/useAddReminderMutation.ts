import { useMutation, useQueryClient } from 'react-query'

import { api } from 'api/api'
import { GetRemindersResponse } from 'api/gen'
import { MutationOptions, RemindersMutationOnErrorArgs } from 'features/offer/queries/types'
import { QueryKeys } from 'libs/queryKeys'

export const useAddReminderMutation = (options?: MutationOptions) => {
  const queryClient = useQueryClient()

  return useMutation((offerId: number) => api.postNativeV1MeReminders({ offerId }), {
    onMutate: async (offerId) => {
      await queryClient.cancelQueries([QueryKeys.REMINDERS])
      const previousReminders = queryClient.getQueryData<GetRemindersResponse>([
        QueryKeys.REMINDERS,
      ])

      const newReminder = {
        id: 0,
        offer: { id: offerId },
      }

      const reminders = previousReminders?.reminders?.length
        ? [...previousReminders.reminders, newReminder]
        : [newReminder]

      queryClient.setQueryData<GetRemindersResponse>([QueryKeys.REMINDERS], {
        reminders,
      })

      return {
        previousReminders,
      }
    },
    onError: (args: RemindersMutationOnErrorArgs) => {
      const { context, error } = args
      queryClient.setQueryData([QueryKeys.REMINDERS], context?.previousReminders)
      options?.onError?.(error)
    },
    onSettled: () => queryClient.invalidateQueries([QueryKeys.REMINDERS]),
  })
}
