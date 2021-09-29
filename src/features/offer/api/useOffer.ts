import { useQuery } from 'react-query'

import { api } from 'api/api'
import { ApiError } from 'api/apiHelpers'
import { OfferResponse } from 'api/gen'
import { navigateToHome } from 'features/navigation/helpers'
import { OfferNotFound } from 'features/offer/pages/OfferNotFound'
import { OfferNotFoundError } from 'libs/monitoring'
import { QueryKeys } from 'libs/queryKeys'

async function getOfferById(offerId: number, retry: () => void) {
  if (!offerId) {
    throw new OfferNotFoundError(offerId, OfferNotFound, retry)
  }
  try {
    return await api.getnativev1offerofferId(offerId)
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      throw new OfferNotFoundError(offerId, OfferNotFound, retry)
    }
    throw error
  }
}

export const useOffer = ({ offerId }: { offerId: number }) =>
  useQuery<OfferResponse | undefined>([QueryKeys.OFFER, offerId], () => {
    if (offerId) {
      return getOfferById(offerId, navigateToHome)
    } else {
      return undefined
    }
  })
