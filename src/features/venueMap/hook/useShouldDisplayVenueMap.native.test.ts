import { useShouldDisplayVenueMap } from 'features/venueMap/hook/useShouldDisplayVenueMap'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { renderHook } from 'tests/utils'

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)

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

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

describe('useShouldDisplayVenueMap', () => {
  it('should render venue map when user is located and feature flag enabled', () => {
    const { result } = renderHook(useShouldDisplayVenueMap)

    expect(result.current).toEqual({
      hasGeolocPosition: true,
      selectedLocationMode: LocationMode.AROUND_ME,
      shouldDisplayVenueMap: true,
    })
  })

  it('should not render venue map when feature flag is disabled', () => {
    useFeatureFlagSpy.mockReturnValueOnce(false)
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
