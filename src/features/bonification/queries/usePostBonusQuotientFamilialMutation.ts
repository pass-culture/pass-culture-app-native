import { DefaultError, MutationOptions, useMutation } from '@tanstack/react-query'

import { api } from 'api/api'
import { BonusCreditRequest } from 'api/gen'
import { EmptyResponse } from 'libs/fetch'

export const usePostBonusQuotientFamilialMutation = ({
  onSuccess,
  onError,
}: MutationOptions<EmptyResponse, DefaultError, BonusCreditRequest>) =>
  useMutation({
    mutationFn: (body: BonusCreditRequest) => {
      return api.postNativeV1SubscriptionBonusQuotientFamilial(body)
    },
    onSuccess,
    onError,
  })
