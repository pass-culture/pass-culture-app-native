import { useMutation } from 'react-query'

import { api } from 'api/api'
import { ChangeBeneficiaryEmailBody, EmailChangeConfirmationResponse } from 'api/gen'

export const useConfirmChangeEmailMutationV2 = ({
  onSuccess,
  onError,
}: {
  onSuccess: (response: EmailChangeConfirmationResponse) => void
  onError: (error: unknown) => void
}) => {
  return useMutation(
    (body: ChangeBeneficiaryEmailBody) => api.postNativeV2ProfileEmailUpdateConfirm(body),
    { onSuccess, onError }
  )
}
