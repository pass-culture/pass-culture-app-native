import { useShouldDisplayVenueMap } from 'features/venueMap/hook/useShouldDisplayVenueMap'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { renderHook } from 'tests/utils'

const mockedPlace: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  type: 'street',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}

const mockHasGeolocPosition = true
const mockSelectedLocationMode = LocationMode.AROUND_ME

const mockUseLocation = jest.fn(() => ({
  hasGeolocPosition: mockHasGeolocPosition,
  selectedLocationMode: mockSelectedLocationMode,
  place: mockedPlace,
}))
jest.mock('libs/location', () => ({
  useLocation: () => mockUseLocation(),
}))

describe('useShouldDisplayVenueMap', () => {
  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_VENUE_MAP])
  })

  it('should render venue map when user is located and feature flag enabled', () => {
    const { result } = renderHook(useShouldDisplayVenueMap)

    expect(result.current).toEqual({
      hasGeolocPosition: true,
      selectedLocationMode: LocationMode.AROUND_ME,
      shouldDisplayVenueMap: true,
    })
  })

  it('should not render venue map when feature flag is disabled', () => {
    setFeatureFlags()
    const { result } = renderHook(useShouldDisplayVenueMap)

    expect(result.current).toEqual({
      hasGeolocPosition: true,
      selectedLocationMode: LocationMode.AROUND_ME,
      shouldDisplayVenueMap: false,
    })
  })

  it('should not render venue map when user is not located', () => {
    mockUseLocation.mockReturnValueOnce({
      hasGeolocPosition: false,
      selectedLocationMode: mockSelectedLocationMode,
      place: mockedPlace,
    })
    const { result } = renderHook(useShouldDisplayVenueMap)

    expect(result.current).toEqual({
      hasGeolocPosition: false,
      selectedLocationMode: LocationMode.AROUND_ME,
      shouldDisplayVenueMap: false,
    })
  })

  it('should not render venue map  when user is located everywhere', () => {
    mockUseLocation.mockReturnValueOnce({
      hasGeolocPosition: mockHasGeolocPosition,
      selectedLocationMode: LocationMode.EVERYWHERE,
      place: mockedPlace,
    })
    const { result } = renderHook(useShouldDisplayVenueMap)

    expect(result.current).toEqual({
      hasGeolocPosition: true,
      selectedLocationMode: LocationMode.EVERYWHERE,
      shouldDisplayVenueMap: false,
    })
  })
})
