import { useQuery } from 'react-query'

import { QueryKeys } from 'libs/queryKeys'
import { Offer } from 'shared/offer/types'

export const useGetHighlightOfferQuery2 = ({
  id,
  getHighlightOffer,
}: {
  id: string
  getHighlightOffer: () => Promise<Offer[] | undefined>
}) =>
  useQuery({
    queryKey: [QueryKeys.HIGHLIGHT_OFFER, id],
    queryFn: getHighlightOffer,
  })
