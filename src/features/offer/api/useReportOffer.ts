import { useMutation } from 'react-query'

import { api } from 'api/api'
import { OfferReportRequest } from 'api/gen'

interface Props {
  offerId: number
  onSuccess: () => void
  onError: (error: unknown) => void
}

export function useReportOfferMutation({ offerId, onSuccess, onError }: Props) {
  return useMutation(
    (body?: OfferReportRequest) => api.postNativeV1OfferofferIdReport(offerId, body),
    {
      onSuccess,
      onError,
    }
  )
}
