import { useCallback } from 'react'
import { Alert, Linking } from 'react-native'

import { LocationState } from 'features/location/types'
import { GeolocPermissionState } from 'libs/location/location'
import { LocationMode } from 'libs/location/types'

type Props = {
  dismissModal: () => void
  shouldOpenDirectlySettings?: boolean
  shouldDirectlyValidate?: boolean
  setTempLocationMode: LocationState['setTempLocationMode']
  setSelectedLocationMode: LocationState['setSelectedLocationMode']
  permissionState: LocationState['permissionState']
  setPlace: LocationState['setPlace']
  onModalHideRef: LocationState['onModalHideRef']
  showGeolocPermissionModal: LocationState['showGeolocPermissionModal']
  requestGeolocPermission: LocationState['requestGeolocPermission']
  hasGeolocPosition: LocationState['hasGeolocPosition']
}

export const useGeolocationDialogs = ({
  dismissModal,
  shouldOpenDirectlySettings,
  shouldDirectlyValidate,
  setTempLocationMode,
  setSelectedLocationMode,
  permissionState,
  setPlace,
  onModalHideRef,
  showGeolocPermissionModal,
  requestGeolocPermission,
  hasGeolocPosition,
}: Props) => {
  const runGeolocationDialogs = useCallback(async () => {
    const selectGeoLocationMode = () => setTempLocationMode(LocationMode.AROUND_ME)
    const selectAroundMeMode = () => setSelectedLocationMode(LocationMode.AROUND_ME)
    const selectEverywhereMode = () => setSelectedLocationMode(LocationMode.EVERYWHERE)

    if (permissionState === GeolocPermissionState.NEVER_ASK_AGAIN) {
      setPlace(null)
      selectEverywhereMode()
      if (shouldOpenDirectlySettings) {
        Linking.openSettings()
      } else {
        if (!shouldDirectlyValidate) {
          dismissModal()
        }
        onModalHideRef.current = showGeolocPermissionModal
      }
    } else if (permissionState === GeolocPermissionState.GRANTED && !hasGeolocPosition) {
      Alert.alert(
        'Paramètres de localisation',
        'Nous n’avons pas pu récupérer ta position. Vérifie que la localisation est bien activée sur ton téléphone.',
        [{ text: 'OK', onPress: selectEverywhereMode }]
      )
    } else if (permissionState === GeolocPermissionState.GRANTED && shouldDirectlyValidate) {
      setPlace(null)
      selectAroundMeMode()
    } else {
      await requestGeolocPermission({
        onAcceptance: shouldDirectlyValidate ? selectAroundMeMode : selectGeoLocationMode,
        onRefusal: selectEverywhereMode,
      })
    }
  }, [
    permissionState,
    setTempLocationMode,
    setSelectedLocationMode,
    setPlace,
    shouldOpenDirectlySettings,
    dismissModal,
    onModalHideRef,
    showGeolocPermissionModal,
    shouldDirectlyValidate,
    requestGeolocPermission,
    hasGeolocPosition,
  ])

  return { runGeolocationDialogs }
}
