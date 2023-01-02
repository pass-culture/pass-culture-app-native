export interface ChangeEmailRequest {
  email: string
  password: string
}

export type ResetRecreditAmountToShowMutationOptions = {
  onSuccess: () => void
  onError: (error: unknown) => void
}
