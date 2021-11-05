import { useMutation } from 'react-query'

export enum CHANGE_EMAIL_ERROR_CODE {
  TOKEN_EXISTS = 'TOKEN_EXISTS',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  INVALID_EMAIL = 'INVALID_EMAIL',
  EMAIL_UPDATE_ATTEMPTS_LIMIT = 'EMAIL_UPDATE_ATTEMPTS_LIMIT',
}
let mockedErrorCodeIndex = 0

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
      new Promise((resolve, reject) =>
        setTimeout(() => {
          mockedErrorCodeIndex = (mockedErrorCodeIndex + 1) % 4
          reject({ code: Object.values(CHANGE_EMAIL_ERROR_CODE)[mockedErrorCodeIndex] })
        }, 2000)
      ),
    {
      onSuccess,
      onError,
    }
  )
}
