import { useQuery } from 'react-query'

import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import { OfferResponseV2 } from 'api/gen'
import { OfferNotFound } from 'features/offer/pages/OfferNotFound/OfferNotFound'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { OfferNotFoundError, LogTypeEnum } from 'libs/monitoring/errors'
import { QueryKeys } from 'libs/queryKeys'

const getOfferById = async (offerId: number, logType: LogTypeEnum) => {
  if (!offerId) {
    throw new OfferNotFoundError(offerId, {
      Screen: OfferNotFound,
      logType,
    })
  }
  try {
    return await api.getNativeV2OfferofferId(offerId)
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      // This happens when the offer has been rejected but it is still indexed on Algolia
      // due to asynchronous reindexing of the back office
      throw new OfferNotFoundError(offerId, {
        Screen: OfferNotFound,
        logType,
      })
    }
    throw error
  }
}

export const useOfferQuery = ({ offerId }: { offerId: number }) => {
  const { logType } = useLogTypeFromRemoteConfig()

  return useQuery<OfferResponseV2 | undefined>([QueryKeys.OFFER, offerId], () =>
    offerId ? getOfferById(offerId, logType) : undefined
  )
}
