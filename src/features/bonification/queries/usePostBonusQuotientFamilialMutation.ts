import { DefaultError, MutationOptions, useMutation } from '@tanstack/react-query'

import { api } from 'api/api'
import { QuotientFamilialBonusCreditRequest } from 'api/gen'
import { EmptyResponse } from 'libs/fetch'

export const usePostBonusQuotientFamilialMutation = ({
  onSuccess,
  onError,
}: MutationOptions<EmptyResponse, DefaultError, QuotientFamilialBonusCreditRequest>) =>
  useMutation({
    mutationFn: (body: QuotientFamilialBonusCreditRequest) => {
      return api.postNativeV1SubscriptionBonusQuotientFamilial(body)
    },
    onSuccess,
    onError,
  })
