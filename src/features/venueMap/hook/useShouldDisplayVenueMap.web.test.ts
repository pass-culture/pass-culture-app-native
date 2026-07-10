import { useShouldDisplayVenueMap } from 'features/venueMap/hook/useShouldDisplayVenueMap'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { LocationMode } from 'libs/location/types'
import {
  defaultLocationState,
  locationActions,
  useLocationV2,
} from 'libs/locationV2/location.store'
import { renderHook } from 'tests/utils/web'

describe('useShouldDisplayVenueMap', () => {
  beforeEach(() => {
    useLocationV2.setState(defaultLocationState)
    locationActions.setGeolocPosition({ longitude: -52.669736, latitude: 5.16186 })
    locationActions.setLocationMode(LocationMode.AROUND_ME)
  })

  it('should not render venue map on web', () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_VENUE_MAP])

    const { result } = renderHook(useShouldDisplayVenueMap)

    expect(result.current).toEqual({
      hasGeolocPosition: true,
      selectedLocationMode: LocationMode.AROUND_ME,
      shouldDisplayVenueMap: false,
    })
  })
})
