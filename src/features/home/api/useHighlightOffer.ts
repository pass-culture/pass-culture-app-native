import { useQuery } from 'react-query'

import { useHomePosition } from 'features/home/helpers/useHomePosition'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { fetchOffersByEan } from 'libs/algolia/fetchAlgolia/fetchOffersByEan'
import { fetchOffersByIds } from 'libs/algolia/fetchAlgolia/fetchOffersByIds'
import { fetchOffersByTags } from 'libs/algolia/fetchAlgolia/fetchOffersByTags'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'
import { Offer } from 'shared/offer/types'

type UseHightlightOfferParams = {
  id: string
  offerId?: string
  offerEan?: string
  offerTag?: string
}

export const useHighlightOffer = ({
  id,
  offerId,
  offerEan,
  offerTag,
}: UseHightlightOfferParams) => {
  const isUserUnderage = useIsUserUnderage()
  const netInfo = useNetInfoContext()
  const transformOfferHits = useTransformOfferHits()
  const { position } = useHomePosition()

  const offerByIdQuery = async () => {
    if (!offerId) return undefined

    const result = await fetchOffersByIds({
      objectIds: [offerId],
      isUserUnderage,
    })

    return result
  }

  const offerByTagQuery = async () => {
    if (!offerTag) return undefined

    const result = await fetchOffersByTags({
      tags: [offerTag],
      isUserUnderage,
      userLocation: position,
    })

    return result
  }

  const offerByEanQuery = async () => {
    if (!offerEan) return undefined

    return await fetchOffersByEan({
      eanList: [offerEan],
      userLocation: position,
      isUserUnderage,
    })
  }

  const { data } = useQuery({
    queryKey: [QueryKeys.HIGHLIGHT_OFFER, id],
    queryFn: offerEan ? offerByEanQuery : offerTag ? offerByTagQuery : offerByIdQuery,
    enabled: !!netInfo.isConnected,
  })
  const offers = (data?.map(transformOfferHits) as Offer[]) ?? []
  return offers[0]
}
