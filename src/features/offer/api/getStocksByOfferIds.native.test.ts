import { api } from 'api/api'
import { OffersStocksResponse } from 'api/gen'
import { LogTypeEnum, OfferNotFoundError } from 'libs/monitoring/errors'
import { mockServer } from 'tests/mswServer'

import { getStocksByOfferIds } from './getStocksByOfferIds'

const apiPostNativeV3OffersStocksSpy = jest.spyOn(api, 'postNativeV3OffersStocks')

jest.mock('libs/firebase/analytics/analytics')

describe('getStocksByOfferIds', () => {
  it('should return empty array when no offer ids are provided', async () => {
    const result = await getStocksByOfferIds([], LogTypeEnum.INFO)

    expect(result).toEqual({ offers: [] })
  })

  it('should call api.postNativeV3OffersStocks with correct parameters', async () => {
    mockServer.postApi<OffersStocksResponse>('/v3/offers/stocks', {})
    await getStocksByOfferIds([1, 2], LogTypeEnum.INFO)

    expect(apiPostNativeV3OffersStocksSpy).toHaveBeenCalledWith({
      offer_ids: [1, 2],
    })
  })

  it('should throw OfferNotFoundError when API returns 404', async () => {
    mockServer.postApi<OffersStocksResponse>('/v3/offers/stocks', {
      responseOptions: { statusCode: 404, data: { offers: [] } },
    })

    await expect(getStocksByOfferIds([1], LogTypeEnum.ERROR)).rejects.toThrow(OfferNotFoundError)
  })
})
