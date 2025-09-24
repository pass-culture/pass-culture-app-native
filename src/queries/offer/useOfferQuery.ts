import { useQuery } from '@tanstack/react-query'

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

export const useOfferQuery = <T = OfferResponseV2>({
  offerId,
  select,
}: {
  offerId: number
  select?: (data: OfferResponseV2) => T | undefined
}) => {
  const { logType } = useLogTypeFromRemoteConfig()

  return useQuery({
    queryKey: [QueryKeys.OFFER, offerId],
    queryFn: () => getOfferById(offerId, logType),
    enabled: !!offerId,
    select,
  })
}
