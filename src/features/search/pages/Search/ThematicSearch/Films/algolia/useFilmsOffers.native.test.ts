import * as fetchFilmsOffersModule from 'features/search/pages/Search/ThematicSearch/Films/algolia/fetchFilmsOffers'
import { useFilmsOffers } from 'features/search/pages/Search/ThematicSearch/Films/algolia/useFilmsOffers'
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

const filmsOffer = mockBuilder.searchResponseOffer({})

const fetchOffersSpy = jest
  .spyOn(fetchFilmsOffersModule, 'fetchFilmsOffers')
  .mockResolvedValue([filmsOffer])

jest.mock('libs/firebase/analytics/analytics')

describe('useCinemaOffers', () => {
  it('should fetch cinema offers', async () => {
    renderHook(() => useFilmsOffers(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await act(() => {})

    expect(fetchOffersSpy).toHaveBeenCalledWith({ userLocation: mockUserLocation }),
      expect.any(Object),
      false,
      undefined
  })
})
