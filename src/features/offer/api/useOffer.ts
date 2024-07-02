import { useQuery } from 'react-query'

import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import { OfferResponseV2 } from 'api/gen'
import { OfferNotFound } from 'features/offer/pages/OfferNotFound/OfferNotFound'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { OfferNotFoundError } from 'libs/monitoring'
import { LogTypeEnum } from 'libs/monitoring/errors'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

async function getOfferById(offerId: number, logType: LogTypeEnum) {
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

export const useOffer = ({ offerId }: { offerId: number }) => {
  const netInfo = useNetInfoContext()
  const { logType } = useLogTypeFromRemoteConfig()

  return useQuery<OfferResponseV2 | undefined>(
    [QueryKeys.OFFER, offerId],
    () => (offerId ? getOfferById(offerId, logType) : undefined),
    { enabled: !!netInfo.isConnected }
  )
}
