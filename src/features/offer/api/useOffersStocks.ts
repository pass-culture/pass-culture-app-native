import { useQuery } from 'react-query'

import { ApiError } from 'api/ApiError'
import {
  ExpenseDomain,
  OfferPreviewResponse,
  OfferStockResponse,
  OfferVenueResponse,
  SubcategoryIdEnum,
} from 'api/gen'
import { offersStocksFixtures } from 'features/offer/components/MoviesScreeningCalendar/fixtures/offersStocks.fixtures'
import { OfferNotFound } from 'features/offer/pages/OfferNotFound/OfferNotFound'
import { OfferNotFoundError } from 'libs/monitoring'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

type NewOfferStockResponse = OfferStockResponse
// TO DELETE -> Temporary type waiting for the backend
export type NewOfferPreviewResponse = Omit<OfferPreviewResponse, 'stocks'> & {
  stocks: Array<NewOfferStockResponse>
  isExternalBookingsDisabled: boolean
  isExpired: boolean
  expenseDomains: ExpenseDomain[]
  isDigital: boolean
  isEducational: boolean
  isForbiddenToUnderage: boolean
  isReleased: boolean
  isSoldOut: boolean
  subcategoryId: SubcategoryIdEnum
  externalTicketOfficeUrl: string | null
  venue: OfferVenueResponse
}

export interface NewOffersStocksResponse {
  /**
   * @type {Array<OfferPreviewResponse>}
   * @memberof OffersStocksResponse
   */
  offers: Array<NewOfferPreviewResponse>
}

async function getStocksByOfferIds(offerIds: number[]) {
  if (offerIds.length === 0) {
    throw new OfferNotFoundError(offerIds, { Screen: OfferNotFound })
  }
  try {
    // return await (api.postNativeV1OffersStocks({
    //   offer_ids: offerIds,
    // }) as Promise<NewOffersStocksResponse>)
    return offersStocksFixtures
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      // This happens when the offer has been rejected but it is still indexed on Algolia
      // due to asynchronous reindexing of the back office
      throw new OfferNotFoundError(offerIds, {
        Screen: OfferNotFound,
        shouldBeCapturedAsInfo: true,
      })
    }
    throw error
  }
}

export const useOffersStocks = ({ offerIds }: { offerIds: number[] }) => {
  const netInfo = useNetInfoContext()

  return useQuery<NewOffersStocksResponse>(
    [QueryKeys.OFFER, offerIds],
    () => getStocksByOfferIds(offerIds),
    { enabled: !!netInfo.isConnected }
  )
}
