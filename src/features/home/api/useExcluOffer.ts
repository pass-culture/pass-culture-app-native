import { useQuery } from 'react-query'

import { api } from 'api/api'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

export const useExcluOffer = (id: number) => {
  const netInfo = useNetInfoContext()

  return useQuery(
    [QueryKeys.OFFER, id],
    async () => {
      try {
        return await api.getnativev1offerofferId(id)
      } catch (error) {
        // do nothing as an offer in contentful may not be in the backend
        return null
      }
    },
    { enabled: !!netInfo.isConnected && typeof id === 'number' }
  )
}
