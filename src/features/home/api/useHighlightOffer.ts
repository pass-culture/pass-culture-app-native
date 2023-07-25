import { useQuery } from 'react-query'

import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { fetchOffersByIds } from 'libs/algolia/fetchAlgolia/fetchOffersByIds'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'
import { Offer } from 'shared/offer/types'

export const useHighlightOffer = (id: string, offerId?: string) => {
  const isUserUnderage = useIsUserUnderage()
  const netInfo = useNetInfoContext()
  const transformOfferHits = useTransformOfferHits()

  const offerByIdQuery = async () => {
    if (!offerId) return undefined

    const result = await fetchOffersByIds({
      objectIds: [offerId],
      isUserUnderage,
    })

    return result
  }

  const { data } = useQuery({
    queryKey: [QueryKeys.HIGHLIGHT_OFFER, id],
    queryFn: offerByIdQuery,
    enabled: !!netInfo.isConnected,
  })

  const offers = (data?.map(transformOfferHits) as Offer[]) ?? []
  return offers[0]
}
