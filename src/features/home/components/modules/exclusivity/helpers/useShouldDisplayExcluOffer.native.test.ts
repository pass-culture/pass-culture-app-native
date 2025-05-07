import { UseQueryResult } from 'react-query'

import { OfferResponseV2 } from 'api/gen'
import { useShouldDisplayExcluOffer } from 'features/home/components/modules/exclusivity/helpers/useShouldDisplayExcluOffer'
import * as excluOfferAPI from 'features/home/queries/useExcluOfferQuery'
import { ExclusivityModule } from 'features/home/types'
import { offerResponseSnap as mockOffer } from 'features/offer/fixtures/offerResponse'
import { useMaxPrice } from 'features/search/helpers/useMaxPrice/useMaxPrice'
import { Position } from 'libs/location'
import { renderHook } from 'tests/utils'

let display: ExclusivityModule['displayParameters'] = {
  aroundRadius: 20,
  isGeolocated: true,
}

let mockPosition: Position = undefined
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    userLocation: mockPosition,
  }),
}))

jest.mock('features/search/helpers/useMaxPrice/useMaxPrice')
const mockedUseMaxPrice = jest.mocked(useMaxPrice)
mockedUseMaxPrice.mockReturnValue(300_00)

const offerId = 116656
const excluOfferAPISpy = jest.spyOn(excluOfferAPI, 'useExcluOfferQuery')
excluOfferAPISpy.mockReturnValue({
  isLoading: false,
  data: mockOffer,
} as unknown as UseQueryResult<OfferResponseV2>)

jest.mock('libs/firebase/analytics/analytics')

describe('useShouldDisplayExcluOffer', () => {
  it('should display offer if no display parameters available', () => {
    const { result } = renderHook(() => useShouldDisplayExcluOffer(undefined, offerId))

    expect(result.current).toBe(true)
  })

  it('should not display offer if price is above user max credit', () => {
    mockedUseMaxPrice.mockReturnValueOnce(3)
    const { result } = renderHook(() => useShouldDisplayExcluOffer(display, offerId))

    expect(result.current).toBe(false)
  })

  describe('user with geolocation activated', () => {
    it('should display offer if user is within radius', () => {
      mockPosition = { latitude: 20, longitude: 2 }
      const { result } = renderHook(() => useShouldDisplayExcluOffer(display, offerId))

      expect(result.current).toBe(true)
    })

    it('should not display offer if user is too far from offer', () => {
      mockPosition = { latitude: 52.5, longitude: 13.4 }
      const { result } = renderHook(() => useShouldDisplayExcluOffer(display, offerId))

      expect(result.current).toBe(false)
    })

    it('should not display offer if offer coodinates are not available', () => {
      mockPosition = { latitude: 20, longitude: 2 }
      const coordinates = { latitude: undefined, longitude: undefined }
      const offerWithoutCoordinates = { ...mockOffer, venue: { ...mockOffer.venue, coordinates } }
      excluOfferAPISpy.mockReturnValueOnce({
        isLoading: false,
        data: offerWithoutCoordinates,
      } as unknown as UseQueryResult<OfferResponseV2>)

      const { result } = renderHook(() => useShouldDisplayExcluOffer(display, offerId))

      expect(result.current).toBe(false)
    })
  })

  describe('user with geolocation deactivated', () => {
    beforeAll(() => {
      mockPosition = null
    })

    it('should display offer if module is not geolocated', () => {
      display = { aroundRadius: 20, isGeolocated: false }
      const { result } = renderHook(() => useShouldDisplayExcluOffer(display, offerId))

      expect(result.current).toBe(true)
    })

    it('should not display offer if module is geolocated', () => {
      display = { aroundRadius: 20, isGeolocated: true }
      const { result } = renderHook(() => useShouldDisplayExcluOffer(display, offerId))

      expect(result.current).toBe(false)
    })
  })
})
