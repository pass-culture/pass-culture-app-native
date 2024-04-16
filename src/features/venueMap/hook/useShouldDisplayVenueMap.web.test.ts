import { useShouldDisplayVenueMap } from 'features/venueMap/hook/useShouldDisplayVenueMap'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { renderHook } from 'tests/utils/web'

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)

const mockedPlace: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  type: 'street',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}
const mockUseLocation = jest.fn(() => ({
  hasGeolocPosition: true,
  selectedLocationMode: LocationMode.AROUND_ME,
  place: mockedPlace,
}))
jest.mock('libs/location', () => ({
  useLocation: () => mockUseLocation(),
}))

describe('useShouldDisplayVenueMap', () => {
  it('should not render venue map on web', () => {
    const { result } = renderHook(useShouldDisplayVenueMap)

    expect(result.current).toBe(false)
  })
})
