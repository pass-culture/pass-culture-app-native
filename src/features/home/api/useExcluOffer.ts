import { useQuery } from 'react-query'

import { api } from 'api/api'
import { QueryKeys } from 'libs/queryKeys'

export const useExcluOffer = (id: number) => {
  return useQuery(
    [QueryKeys.OFFER, id],
    async () => {
      try {
        return await api.getNativeV1OfferofferId(id)
      } catch (error) {
        // do nothing as an offer in contentful may not be in the backend
        return null
      }
    },
    { enabled: typeof id === 'number' }
  )
}
