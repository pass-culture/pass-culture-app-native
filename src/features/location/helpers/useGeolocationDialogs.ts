import { useCallback } from 'react'
import { Linking } from 'react-native'

import { LocationState } from 'features/location/types'
import { GeolocPermissionState } from 'libs/location'
import { LocationMode } from 'libs/location/types'

type Props = {
  dismissModal: () => void
  shouldOpenDirectlySettings?: boolean
} & LocationState

export const useGeolocationDialogs = ({
  dismissModal,
  shouldOpenDirectlySettings,
  ...props
}: Props) => {
  const {
    setTempLocationMode,
    setSelectedLocationMode,
    permissionState,
    setPlaceGlobally,
    onModalHideRef,
    showGeolocPermissionModal,
    requestGeolocPermission,
  } = props

  const runGeolocationDialogs = useCallback(async () => {
    const selectGeoLocationMode = () => setTempLocationMode(LocationMode.AROUND_ME)
    const selectEverywhereMode = () => setSelectedLocationMode(LocationMode.EVERYWHERE)

    if (permissionState === GeolocPermissionState.NEVER_ASK_AGAIN) {
      setPlaceGlobally(null)
      selectEverywhereMode()
      if (shouldOpenDirectlySettings) {
        Linking.openSettings()
      } else {
        dismissModal()
        onModalHideRef.current = showGeolocPermissionModal
      }
    } else {
      await requestGeolocPermission({
        onAcceptance: selectGeoLocationMode,
        onRefusal: selectEverywhereMode,
      })
    }
  }, [
    permissionState,
    setTempLocationMode,
    setSelectedLocationMode,
    setPlaceGlobally,
    shouldOpenDirectlySettings,
    dismissModal,
    onModalHideRef,
    showGeolocPermissionModal,
    requestGeolocPermission,
  ])

  return { runGeolocationDialogs }
}
