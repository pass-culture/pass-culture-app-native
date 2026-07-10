import { Platform } from 'react-native'

import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { LocationMode } from 'libs/location/types'
import { useIsGeolocated, useLocationMode } from 'libs/locationV2/location.store'

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

  const hasGeolocPosition = useIsGeolocated()
  const selectedLocationMode = useLocationMode()
  const isLocated =
    selectedLocationMode === LocationMode.AROUND_PLACE ||
    (selectedLocationMode === LocationMode.AROUND_ME && hasGeolocPosition)

  return {
    shouldDisplayVenueMap: !!enabledVenueMap && isLocated && !isWeb,
    hasGeolocPosition,
    selectedLocationMode,
  }
}
