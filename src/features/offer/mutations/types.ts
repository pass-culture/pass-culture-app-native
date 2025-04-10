import { ApiError } from 'api/ApiError'
import { GetRemindersResponse } from 'api/gen'

export type MutationOptions = {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

export type RemindersMutationContext = {
  previousReminders: GetRemindersResponse | undefined
}

export type RemindersMutationOnErrorArgs = {
  error: Error | ApiError
  variables: number
  context: RemindersMutationContext
}
