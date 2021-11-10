import {
  UseChangeEmailMutationProps,
  UseValidateEmailChangeMutationProps,
} from 'features/profile/mutations'

export enum CHANGE_EMAIL_ERROR_CODE {
  TOKEN_EXISTS = 'TOKEN_EXISTS',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  INVALID_EMAIL = 'INVALID_EMAIL',
  EMAIL_UPDATE_ATTEMPTS_LIMIT = 'EMAIL_UPDATE_ATTEMPTS_LIMIT',
}
export const useChangeEmailMutation = jest.fn(({ onSuccess }: UseChangeEmailMutationProps) => ({
  mutate: () => onSuccess(),
}))

export const useValidateEmailChangeMutation = jest.fn(
  ({ onSuccess }: UseValidateEmailChangeMutationProps) => ({
    mutate: () => onSuccess(),
  })
)
