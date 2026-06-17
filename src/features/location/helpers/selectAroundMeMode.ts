import { Linking } from 'react-native'

import { analytics } from 'libs/analytics/provider'
import { GeolocPermissionState } from 'libs/location/location'
import { LocationMode } from 'libs/location/types'
import { contextualRequestGeolocPermission } from 'libs/locationV2/location.methods'
import { locationActions, locationSelectors } from 'libs/locationV2/location.store'
import { locationModalActions } from 'libs/locationV2/locationModal.store'

type Params = {
  shouldOpenDirectlySettings?: boolean
}
export const selectAroundMeMode = async ({ shouldOpenDirectlySettings }: Params = {}) => {
  const permissionState = locationSelectors.selectPermissionState()

  if (permissionState === GeolocPermissionState.NEVER_ASK_AGAIN) {
    if (shouldOpenDirectlySettings) {
      void Linking.openSettings()
      void analytics.logOpenLocationSettings()
    } else {
      locationActions.showPermissionModal()
    }
  } else {
    await contextualRequestGeolocPermission({
      onAcceptance: () => locationModalActions.setLocationMode(LocationMode.AROUND_ME),
    })
  }
}
