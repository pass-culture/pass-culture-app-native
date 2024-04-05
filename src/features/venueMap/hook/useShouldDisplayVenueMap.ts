import { Platform } from 'react-native'

import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'

const isWeb = Platform.OS === 'web'

export const useShouldDisplayVenueMap = (
  featureFlag: RemoteStoreFeatureFlags = RemoteStoreFeatureFlags.WIP_VENUE_MAP
): boolean => {
  const enabledVenueMap = useFeatureFlag(featureFlag)

  const { hasGeolocPosition, selectedLocationMode } = useLocation()
  const isLocated =
    selectedLocationMode === LocationMode.AROUND_PLACE ||
    (selectedLocationMode === LocationMode.AROUND_ME && hasGeolocPosition)

  return !!enabledVenueMap && isLocated && !isWeb
}
