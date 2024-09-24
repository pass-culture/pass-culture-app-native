import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import { OfferNotFoundError } from 'libs/monitoring'
import { LogTypeEnum } from 'libs/monitoring/errors'

import { getStocksByOfferIds } from './getStocksByOfferIds'

jest.mock('api/api')

describe('getStocksByOfferIds', () => {
  it('should return empty array when no offer ids are provided', async () => {
    const result = await getStocksByOfferIds([], LogTypeEnum.INFO)

    expect(result).toEqual({ offers: [] })
  })

  it('should call api.postNativeV2OffersStocks with correct parameters', async () => {
    const mockApiResponse = { offers: [{ id: 1 }, { id: 2 }] }
    api.postNativeV2OffersStocks = jest.fn().mockResolvedValue(mockApiResponse)

    const result = await getStocksByOfferIds([1, 2], LogTypeEnum.INFO)

    expect(api.postNativeV2OffersStocks).toHaveBeenCalledWith({
      offer_ids: [1, 2],
    })
    expect(result).toEqual(mockApiResponse)
  })

  it('should throw OfferNotFoundError when API returns 404', async () => {
    const apiError = new ApiError(404, 'Not Found')
    api.postNativeV2OffersStocks = jest.fn().mockRejectedValue(apiError)

    await expect(getStocksByOfferIds([1], LogTypeEnum.ERROR)).rejects.toThrow(OfferNotFoundError)
  })

  it('should throw original error for non-404 API errors', async () => {
    const apiError = new ApiError(500, 'Internal Server Error')
    api.postNativeV2OffersStocks = jest.fn().mockRejectedValue(apiError)

    await expect(getStocksByOfferIds([1], LogTypeEnum.ERROR)).rejects.toThrow(apiError)
  })
})
