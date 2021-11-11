import { useMutation } from 'react-query'

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
  onError: (error: { code: CHANGE_EMAIL_ERROR_CODE }) => void
}

export function useChangeEmailMutation({ onSuccess, onError }: UseChangeEmailMutationProps) {
  return useMutation(
    // TODO (PC-11573): call the API once available, and remove `mockedErrorCodeIndex`
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (body: ChangeEmailRequest) =>
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      new Promise((resolve, reject) =>
        setTimeout(() => {
          resolve(undefined)
        }, 2000)
      ),
    {
      onSuccess,
      onError,
    }
  )
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
