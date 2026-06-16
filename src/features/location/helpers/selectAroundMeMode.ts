import { GeolocPermissionState } from 'libs/location/location'
import { LocationMode } from 'libs/location/types'
import { contextualRequestGeolocPermission } from 'libs/locationV2/location.methods'
import { locationActions, locationSelectors } from 'libs/locationV2/location.store'
import { locationModalActions } from 'libs/locationV2/locationModal.store'

export const selectAroundMeMode = async () => {
  const permissionState = locationSelectors.selectPermissionState()

  if (permissionState === GeolocPermissionState.NEVER_ASK_AGAIN) {
    locationActions.showPermissionModal()
  } else {
    await contextualRequestGeolocPermission({
      onAcceptance: () => locationModalActions.setLocationMode(LocationMode.AROUND_ME),
    })
  }
}
