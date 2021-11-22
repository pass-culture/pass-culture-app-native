import { useMutation } from 'react-query'

import { api } from 'api/api'

export enum CHANGE_EMAIL_ERROR_CODE {
  TOKEN_EXISTS = 'TOKEN_EXISTS',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  INVALID_EMAIL = 'INVALID_EMAIL',
  EMAIL_UPDATE_ATTEMPTS_LIMIT = 'EMAIL_UPDATE_ATTEMPTS_LIMIT',
}

interface ChangeEmailRequest {
  email: string
  password: string
}
export interface UseChangeEmailMutationProps {
  onSuccess: () => void
  onError: (error: unknown) => void
}

export function useChangeEmailMutation({ onSuccess, onError }: UseChangeEmailMutationProps) {
  return useMutation((body: ChangeEmailRequest) => api.postnativev1profileupdateEmail(body), {
    onSuccess,
    onError,
  })
}

interface ValidateEmailChangeRequest {
  emailChangeValidationToken: string
}

export interface UseValidateEmailChangeMutationProps {
  onSuccess: () => void
  onError: () => void
}

export function useValidateEmailChangeMutation({
  onSuccess,
  onError,
}: UseValidateEmailChangeMutationProps) {
  return useMutation(
    // TODO (PC-11573): call the API once available
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (body: ValidateEmailChangeRequest) =>
      new Promise((resolve, reject) =>
        setTimeout(() => {
          reject()
        }, 1000)
      ),
    {
      onSuccess,
      onError,
    }
  )
}
