import { searchResponseOfferBuilder } from 'features/offer/components/MoviesScreeningCalendar/offersStockResponse.builder'
import * as fetchCinemaOffersModule from 'features/search/pages/Search/ThematicSearch/Cinema/algolia/fetchCinemaOffers'
import { useCinemaOffers } from 'features/search/pages/Search/ThematicSearch/Cinema/algolia/useCinemaOffers'
import { LocationMode, Position } from 'libs/location/types'
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

const cinemaOffer = searchResponseOfferBuilder().build()

const fetchOffersSpy = jest
  .spyOn(fetchCinemaOffersModule, 'fetchCinemaOffers')
  .mockResolvedValue([cinemaOffer])

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

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
