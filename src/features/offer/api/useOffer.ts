import { useQuery } from 'react-query'

import { api } from 'api/api'
import { ApiError } from 'api/apiHelpers'
import { OfferResponse } from 'api/gen'
import { OfferNotFoundError } from 'libs/monitoring'
import { QueryKeys } from 'libs/queryKeys'

async function getOfferById(offerId: number) {
  if (!offerId) {
    throw new OfferNotFoundError(offerId)
  }
  try {
    return await api.getnativev1offerofferId(offerId)
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      throw new OfferNotFoundError(offerId)
    }
    throw error
  }
}

export const useOffer = ({ offerId }: { offerId: number }) =>
  useQuery<OfferResponse | undefined>([QueryKeys.OFFER, offerId], () => {
    if (offerId) {
      return getOfferById(offerId)
    } else {
      return undefined
    }
  })
