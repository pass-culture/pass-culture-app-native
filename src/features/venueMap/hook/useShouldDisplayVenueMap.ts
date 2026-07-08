import { Platform } from 'react-native'

import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location/location'
import { LocationMode } from 'libs/location/types'
import { useLocationV2 } from 'libs/locationV2/location.store'

const isWeb = Platform.OS === 'web'

type OutputProps = {
  shouldDisplayVenueMap: boolean
  hasGeolocPosition: boolean
  selectedLocationMode: LocationMode
}

export const useShouldDisplayVenueMap = (
  featureFlag: RemoteStoreFeatureFlags = RemoteStoreFeatureFlags.WIP_VENUE_MAP
): OutputProps => {
  const enabledVenueMap = useFeatureFlag(featureFlag)

  const state = useLocationV2()

  const { hasGeolocPosition, selectedLocationMode } = useLocation()
  const isLocated =
    selectedLocationMode === LocationMode.AROUND_PLACE ||
    (selectedLocationMode === LocationMode.AROUND_ME && hasGeolocPosition)

  console.log({ isLocated, hasGeolocPosition, state })

  return {
    shouldDisplayVenueMap: !!enabledVenueMap && isLocated && !isWeb,
    hasGeolocPosition,
    selectedLocationMode,
  }
}
