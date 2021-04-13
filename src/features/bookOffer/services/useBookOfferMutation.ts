import { useMutation, useQueryClient } from 'react-query'

import { api } from 'api/api'
import { BookOfferRequest, BookOfferResponse } from 'api/gen'

interface Props {
  onSuccess: (data: BookOfferResponse) => void
  onError: (error: unknown) => void
}

export const useBookOfferMutation = ({ onSuccess, onError }: Props) => {
  const queryClient = useQueryClient()

  return useMutation((body: BookOfferRequest) => api.postnativev1bookings(body), {
    onSuccess: (data) => {
      queryClient.invalidateQueries('userProfile')
      onSuccess(data)
    },
    onError,
  })
}
