import { useQueries } from 'react-query'

import { api } from 'api/api'
import { OfferResponse } from 'api/gen'
import { ExclusivityPane } from 'features/home/contentful'
import { QueryKeys } from 'libs/queryKeys'

export function useExcluOffers(excluModules: ExclusivityPane[]): OfferResponse[] {
  const offerIds = excluModules.map((exclusivity) => exclusivity.id)

  const queries = useQueries(
    offerIds.map((id) => ({
      queryKey: [QueryKeys.OFFER, id],
      queryFn: async () => {
        try {
          return await api.getnativev1offerofferId(id)
        } catch (error) {
          // do nothing as an offer in contentful may not be in the backend
          return undefined
        }
      },
      enabled: typeof id === 'number',
    }))
  )

  return queries.map(({ data }) => data).filter(Boolean) as OfferResponse[]
}
