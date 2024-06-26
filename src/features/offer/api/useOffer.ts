import { useQuery } from 'react-query'

import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import { OfferResponseV2 } from 'api/gen'
import { OfferNotFound } from 'features/offer/pages/OfferNotFound/OfferNotFound'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { OfferNotFoundError } from 'libs/monitoring'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

async function getOfferById(offerId: number, shouldLogInfo: boolean) {
  if (!offerId) {
    throw new OfferNotFoundError(offerId, {
      Screen: OfferNotFound,
      shouldBeCapturedAsInfo: shouldLogInfo,
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
        shouldBeCapturedAsInfo: shouldLogInfo,
      })
    }
    throw error
  }
}

export const useOffer = ({ offerId }: { offerId: number }) => {
  const netInfo = useNetInfoContext()
  const { shouldLogInfo } = useRemoteConfigContext()

  return useQuery<OfferResponseV2 | undefined>(
    [QueryKeys.OFFER, offerId],
    () => (offerId ? getOfferById(offerId, shouldLogInfo) : undefined),
    { enabled: !!netInfo.isConnected }
  )
}
