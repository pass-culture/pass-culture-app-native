import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import { OfferNotFound } from 'features/offer/pages/OfferNotFound/OfferNotFound'
import { OfferNotFoundError, LogTypeEnum } from 'libs/monitoring/errors'

export const getStocksByOfferIds = async (offerIds: number[], logType: LogTypeEnum) => {
  if (offerIds.length === 0) {
    return { offers: [] }
  }
  try {
    return await api.postNativeV2OffersStocks({
      offer_ids: offerIds,
    })
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      // This happens when the offer has been rejected but it is still indexed on Algolia
      // due to asynchronous reindexing of the back office
      throw new OfferNotFoundError(offerIds, {
        Screen: OfferNotFound,
        logType,
      })
    }
    throw error
  }
}
