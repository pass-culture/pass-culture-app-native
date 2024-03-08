import { useMutation } from 'react-query'

import { api } from 'api/api'
import { ChangeBeneficiaryEmailBody } from 'api/gen'

export const useConfirmChangeEmailMutationV1 = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void
  onError: (error: unknown) => void
}) => {
  return useMutation(
    (body: ChangeBeneficiaryEmailBody) => api.postNativeV1ProfileEmailUpdateConfirm(body),
    { onSuccess, onError }
  )
}
