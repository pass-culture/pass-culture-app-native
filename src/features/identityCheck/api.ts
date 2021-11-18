import { useMutation } from 'react-query'

import { api } from 'api/api'
import { IdentificationSessionResponse } from 'api/gen'

interface RequestIdentificationUrlProps {
  onSuccess: (data: IdentificationSessionResponse) => void
  onError: () => void
  onSettled: () => void
}

export function useRequestIdentificationUrl(options: RequestIdentificationUrlProps) {
  return useMutation(
    (redirectUrl: string) => api.postnativev1ubbleIdentification({ redirectUrl }),
    options
  )
}
