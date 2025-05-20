import { useQuery } from 'react-query'

import { QueryKeys } from 'libs/queryKeys'
import { Offer } from 'shared/offer/types'

export const useGetHighlightOfferQuery = (
  id: string,
  getHighlightOffer: () => Promise<Offer[] | undefined>,
  options?: Partial<{}>
) =>
  useQuery({
    queryKey: [QueryKeys.HIGHLIGHT_OFFER, id],
    queryFn: getHighlightOffer,
  })
