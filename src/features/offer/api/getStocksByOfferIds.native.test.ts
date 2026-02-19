import { api } from 'api/api'
import { OffersStocksResponseV2 } from 'api/gen'
import { LogTypeEnum, OfferNotFoundError } from 'libs/monitoring/errors'
import { mockServer } from 'tests/mswServer'

import { getStocksByOfferIds } from './getStocksByOfferIds'

const apiPostNativeV2OffersStocksSpy = jest.spyOn(api, 'postNativeV2OffersStocks')

jest.mock('libs/firebase/analytics/analytics')

describe('getStocksByOfferIds', () => {
  it('should return empty array when no offer ids are provided', async () => {
    const result = await getStocksByOfferIds([], LogTypeEnum.INFO)

    expect(result).toEqual({ offers: [] })
  })

  it('should call api.postNativeV2OffersStocks with correct parameters', async () => {
    mockServer.postApi<OffersStocksResponseV2>('/v2/offers/stocks', {})
    await getStocksByOfferIds([1, 2], LogTypeEnum.INFO)

    expect(apiPostNativeV2OffersStocksSpy).toHaveBeenCalledWith({
      offer_ids: [1, 2],
    })
  })

  it('should throw OfferNotFoundError when API returns 404', async () => {
    mockServer.postApi<OffersStocksResponseV2>('/v2/offers/stocks', {
      responseOptions: { statusCode: 404, data: { offers: [] } },
    })

    await expect(getStocksByOfferIds([1], LogTypeEnum.ERROR)).rejects.toThrow(OfferNotFoundError)
  })
})
