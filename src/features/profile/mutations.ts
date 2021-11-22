import { useMutation } from 'react-query'

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
    // TODO (PC-11697): call the API once available
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
