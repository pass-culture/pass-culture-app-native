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
      locationModalActions.hide()
      // 2 native modals can't be opened at the same time or the app will freeze, so we need to wait for the first one to be closed
      // we keep the imperative approach to avoid using onModalHide that bursts the logic between files
      setTimeout(() => {
        locationActions.showPermissionModal()
      }, 500)
    }
  } else {
    await contextualRequestGeolocPermission({
      onAcceptance: () => locationModalActions.setLocationMode(LocationMode.AROUND_ME),
    })
  }
}
