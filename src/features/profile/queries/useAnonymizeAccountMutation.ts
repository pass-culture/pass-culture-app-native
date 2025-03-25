import { useMutation } from 'react-query'

import { api } from 'api/api'

type Options = {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export const useAnonymizeAccountMutation = ({ onSuccess, onError }: Options) => {
  const { mutate: anonymizeAccount } = useMutation(() => api.postNativeV1AccountAnonymize(), {
    onSuccess,
    onError,
  })

  return { anonymizeAccount }
}
