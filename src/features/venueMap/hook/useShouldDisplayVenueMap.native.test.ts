import { useShouldDisplayVenueMap } from 'features/venueMap/hook/useShouldDisplayVenueMap'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { LocationMode } from 'libs/location/types'
import {
  defaultLocationState,
  locationActions,
  useLocationV2,
} from 'libs/locationV2/location.store'
import { renderHook } from 'tests/utils'

describe('useShouldDisplayVenueMap', () => {
  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_VENUE_MAP])
    useLocationV2.setState(defaultLocationState)
    locationActions.setGeolocPosition({ longitude: -52.669736, latitude: 5.16186 })
    locationActions.setLocationMode(LocationMode.AROUND_ME)
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
    locationActions.setGeolocPosition(null)
    const { result } = renderHook(useShouldDisplayVenueMap)

    expect(result.current).toEqual({
      hasGeolocPosition: false,
      selectedLocationMode: LocationMode.AROUND_ME,
      shouldDisplayVenueMap: false,
    })
  })

  it('should not render venue map  when user is located everywhere', () => {
    locationActions.setLocationMode(LocationMode.EVERYWHERE)
    const { result } = renderHook(useShouldDisplayVenueMap)

    expect(result.current).toEqual({
      hasGeolocPosition: true,
      selectedLocationMode: LocationMode.EVERYWHERE,
      shouldDisplayVenueMap: false,
    })
  })
})
