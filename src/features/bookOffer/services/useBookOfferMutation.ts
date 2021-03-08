import { useMutation, useQueryClient } from 'react-query'

import { api } from 'api/api'
import { BookOfferRequest } from 'api/gen'

interface Props {
  onSuccess: () => void
  onError: (error: unknown) => void
}

export const useBookOfferMutation = ({ onSuccess, onError }: Props) => {
  const queryClient = useQueryClient()

  return useMutation((body: BookOfferRequest) => api.postnativev1bookOffer(body), {
    onSuccess: () => {
      queryClient.invalidateQueries('userProfile')
      onSuccess()
    },
    onError,
  })
}
