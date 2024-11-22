import * as fetchCinemaOffersModule from 'features/search/pages/Search/ThematicSearch/Cinema/algolia/fetchCinemaOffers'
import { useCinemaOffers } from 'features/search/pages/Search/ThematicSearch/Cinema/algolia/useCinemaOffers'
import { LocationMode, Position } from 'libs/location/types'
import { mockBuilder } from 'tests/mockBuilder'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

jest.mock('libs/network/NetInfoWrapper')

const mockLocationMode = LocationMode.AROUND_ME
const mockUserLocation: Position = { latitude: 2, longitude: 2 }
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    userLocation: mockUserLocation,
    selectedLocationMode: mockLocationMode,
  }),
}))

const cinemaOffers = mockBuilder.searchResponseOffer({})

const fetchOffersSpy = jest
  .spyOn(fetchCinemaOffersModule, 'fetchCinemaOffers')
  .mockResolvedValue([cinemaOffers])

jest.mock('libs/firebase/analytics/analytics')

describe('useCinemaOffers', () => {
  it('should fetch cinema offers', async () => {
    renderHook(() => useCinemaOffers(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await act(() => {})

    expect(fetchOffersSpy).toHaveBeenCalledWith({ userLocation: mockUserLocation }),
      expect.any(Object),
      false,
      undefined
  })
})
