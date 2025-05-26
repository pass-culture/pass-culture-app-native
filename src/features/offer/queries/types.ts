import { ApiError } from 'api/ApiError'
import { GetRemindersResponse } from 'api/gen'

export type MutationOptions = {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

type RemindersMutationContext = {
  previousReminders: GetRemindersResponse | undefined
}

export type RemindersMutationOnErrorArgs = {
  error: Error | ApiError
  variables: number
  context: RemindersMutationContext
}
