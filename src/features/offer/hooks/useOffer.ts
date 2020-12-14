import { useQuery } from 'react-query'

import { api } from 'api/api'
import { OfferResponse } from 'api/gen'

interface UseOfferInterface {
  offerId: number | null
}

export const useOffer = ({ offerId }: UseOfferInterface) => {
  return useQuery<OfferResponse>(
    ['offer', offerId],
    //@ts-ignore: Query is enabled only if offerId is truthy
    () => api.getnativev1offerofferId(offerId.toString()),
    { enabled: !!offerId }
  )
}
