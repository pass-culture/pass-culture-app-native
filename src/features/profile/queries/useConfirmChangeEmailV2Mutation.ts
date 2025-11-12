import { useMutation } from '@tanstack/react-query'

import { api } from 'api/api'
import { ChangeBeneficiaryEmailBody, EmailChangeConfirmationResponse } from 'api/gen'

export const useConfirmChangeEmailV2Mutation = ({
  onSuccess,
  onError,
}: {
  onSuccess: (response: EmailChangeConfirmationResponse) => void
  onError: (error: unknown) => void
}) =>
  useMutation({
    mutationFn: (body: ChangeBeneficiaryEmailBody) =>
      api.postNativeV2ProfileEmailUpdateConfirm(body),
    onSuccess,
    onError,
  })
