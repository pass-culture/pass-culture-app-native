import { useMutation } from 'react-query'

import { api } from 'api/api'
import { ChangeBeneficiaryEmailBody } from 'api/gen'

export interface UseValidateEmailChangeMutationProps {
  onSuccess: () => void
  onError: () => void
}

export function useValidateEmailChangeMutation({
  onSuccess,
  onError,
}: UseValidateEmailChangeMutationProps) {
  return useMutation(
    (body: ChangeBeneficiaryEmailBody) => api.putnativev1profilevalidateEmail(body),
    {
      onSuccess,
      onError,
    }
  )
}
