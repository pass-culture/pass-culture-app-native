import { useMutation } from 'react-query'

interface ChangeEmailRequest {
  email: string
  password: string
}

export function useChangeEmailMutation(onSuccess: () => void, onError: (error: unknown) => void) {
  return useMutation(
    // TODO (PC-11573): call the API once available
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (body: ChangeEmailRequest) => new Promise((resolve) => setTimeout(resolve, 2000)),
    {
      onSuccess,
      onError,
    }
  )
}
