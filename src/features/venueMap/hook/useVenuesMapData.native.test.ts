import { VenueTypeCodeKey } from 'api/gen'
import { Venue } from 'features/venue/types'
import { useVenuesMapData } from 'features/venueMap/hook/useVenuesMapData'
import { useVenuesActions } from 'features/venueMap/store/venuesStore'
import { useVenueTypeCodeActions } from 'features/venueMap/store/venueTypeCodeStore'
import { venuesFixture } from 'libs/algolia/fetchAlgolia/fetchVenues/fixtures/venuesFixture'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook } from 'tests/utils'

const mockSetInitialVenues = jest.fn()
jest.mock('features/venueMap/store/initialVenuesStore', () => ({
  useInitialVenuesActions: () => ({ setInitialVenues: mockSetInitialVenues }),
  useInitialVenues: jest.fn(),
}))

jest.mock('features/venueMap/store/venueTypeCodeStore')
const mockUseVenueTypeCodeActions = useVenueTypeCodeActions as jest.Mock
mockUseVenueTypeCodeActions.mockReturnValue({ setVenueTypeCode: jest.fn() })

const mockSetVenues = jest.fn()
jest.mock('features/venueMap/store/venuesStore')
const mockUseVenuesActions = useVenuesActions as jest.MockedFunction<typeof useVenuesActions>
mockUseVenuesActions.mockReturnValue({ setVenues: mockSetVenues })

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

describe('useVenuesMapData', () => {
  it('should return default values without transformVenues', () => {
    const { result } = renderHook(() => useVenuesMapData(venuesFixture), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    expect(result.current).toEqual({
      currentRegion: {
        latitude: 48.8666,
        latitudeDelta: 0.07830436660332844,
        longitude: 2.3333,
        longitudeDelta: 0.0669250353453928,
      },
      removeSelectedVenue: expect.any(Function),
      selectedVenue: null,
      setCurrentRegion: expect.any(Function),
      setLastRegionSearched: expect.any(Function),
      setSelectedVenue: expect.any(Function),
      venueTypeCode: undefined,
      venuesMap: venuesFixture,
    })
  })

  it('should return transformed venues when transformVenues is provided', async () => {
    const transformedVenues: Venue[] = [
      {
        _geoloc: { lat: 48.8829768, lng: 2.3076798 },
        banner_url:
          'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/venues/CUHQ_1682432163',
        info: 'Paris',
        label: 'Librairie',
        postalCode: '75017',
        venueId: 5392,
        venue_type: VenueTypeCodeKey.BOOKSTORE,
      },
    ]

    const { result } = renderHook(() => useVenuesMapData(transformedVenues), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    expect(result.current.venuesMap).toEqual(transformedVenues)
  })
})
