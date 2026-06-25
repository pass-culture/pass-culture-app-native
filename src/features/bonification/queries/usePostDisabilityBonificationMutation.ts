import { DefaultError, MutationOptions, useMutation } from '@tanstack/react-query'

import { api } from 'api/api'
import { DisabilityBonusCreditRequest } from 'api/gen'
import { EmptyResponse } from 'libs/fetch'

export const usePostDisabilityBonificationMutation = ({
  onSuccess,
  onError,
}: MutationOptions<EmptyResponse, DefaultError, DisabilityBonusCreditRequest>) =>
  useMutation({
    mutationFn: (body: DisabilityBonusCreditRequest) => {
      return api.postNativeV1SubscriptionBonusDisability(body)
    },
    onSuccess,
    onError,
  })
