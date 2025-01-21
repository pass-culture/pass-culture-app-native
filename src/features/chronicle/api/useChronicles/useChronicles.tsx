import { useQuery } from 'react-query'

import { api } from 'api/api'
import { OfferChronicles } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

export const useChronicles = ({ offerId }: { offerId: number }) => {
  return useQuery<OfferChronicles | undefined>([QueryKeys.OFFER_CHRONICLES, offerId], () =>
    offerId ? api.getNativeV1OfferofferIdChronicles(offerId) : undefined
  )
}
