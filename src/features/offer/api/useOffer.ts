import { useQuery } from 'react-query'

import { api } from 'api/api'
import { ApiError } from 'api/apiHelpers'
import { OfferResponse } from 'api/gen'
import { OfferNotFound } from 'features/offer/pages/OfferNotFound'
import { OfferNotFoundError } from 'libs/monitoring'
import { useNetwork } from 'libs/network/useNetwork'
import { QueryKeys } from 'libs/queryKeys'

async function getOfferById(offerId: number) {
  if (!offerId) {
    throw new OfferNotFoundError(offerId, OfferNotFound)
  }
  try {
    return await api.getnativev1offerofferId(offerId)
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      throw new OfferNotFoundError(offerId, OfferNotFound)
    }
    throw error
  }
}

export const useOffer = ({ offerId }: { offerId: number }) => {
  const { isConnected } = useNetwork()

  return useQuery<OfferResponse | undefined>(
    [QueryKeys.OFFER, offerId],
    () => (offerId ? getOfferById(offerId) : undefined),
    { enabled: isConnected }
  )
}
