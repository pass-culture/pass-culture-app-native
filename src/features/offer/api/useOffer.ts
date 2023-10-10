import { useQuery } from 'react-query'

import { api } from 'api/api'
import { ApiError } from 'api/apiHelpers'
import { OfferResponse } from 'api/gen'
import { OfferNotFound } from 'features/offer/pages/OfferNotFound/OfferNotFound'
import { OfferNotFoundError } from 'libs/monitoring'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

async function getOfferById(offerId: number) {
  if (!offerId) {
    throw new OfferNotFoundError(offerId, { Screen: OfferNotFound })
  }
  try {
    return await api.getNativeV1OfferofferId(offerId)
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      throw new OfferNotFoundError(offerId, { Screen: OfferNotFound })
    }
    throw error
  }
}

export const useOffer = ({ offerId }: { offerId: number }) => {
  const netInfo = useNetInfoContext()

  return useQuery<OfferResponse | undefined>(
    [QueryKeys.OFFER, offerId],
    () => (offerId ? getOfferById(offerId) : undefined),
    { enabled: !!netInfo.isConnected }
  )
}
