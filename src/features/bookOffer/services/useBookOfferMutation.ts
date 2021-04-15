import { useMutation, useQueryClient } from 'react-query'

import { api } from 'api/api'
import { BookOfferRequest, BookOfferResponse } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

interface Props {
  onSuccess: (data: BookOfferResponse) => void
  onError: (error: unknown) => void
}

export const useBookOfferMutation = ({ onSuccess, onError }: Props) => {
  const queryClient = useQueryClient()

  return useMutation((body: BookOfferRequest) => api.postnativev1bookings(body), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(QueryKeys.USER_PROFILE)
      onSuccess(data)
    },
    onError,
  })
}
