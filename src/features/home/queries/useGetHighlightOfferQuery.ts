import { useQuery } from 'react-query'

import { QueryKeys } from 'libs/queryKeys'
import { Offer } from 'shared/offer/types'

export const useGetHighlightOfferQuery = (
  id: string,
  getHighlightOffer: () => Promise<Offer[] | undefined>,
  options: Partial<{
    id: string
    getHighlightOffer: () => Promise<Offer[] | undefined>
  }>
) =>
  useQuery({
    queryKey: [QueryKeys.HIGHLIGHT_OFFER, options.id || id],
    queryFn: options.getHighlightOffer || getHighlightOffer,
  })
