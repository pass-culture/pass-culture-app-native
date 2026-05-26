import { useGeolocationDialogs } from 'features/location/helpers/useGeolocationDialogs'
import { LocationState, LocationSubmit } from 'features/location/types'
import { LocationMode } from 'libs/location/types'

type Props = {
  dismissModal: () => void
  shouldOpenDirectlySettings?: boolean
  shouldDirectlyValidate?: boolean
  setTempLocationMode: LocationState['setTempLocationMode']
  setSelectedLocationMode: LocationState['setSelectedLocationMode']
  permissionState: LocationState['permissionState']
  setPlace: LocationState['setPlace']
  showGeolocPermissionModal: LocationState['showGeolocPermissionModal']
  requestGeolocPermission: LocationState['requestGeolocPermission']
  hasGeolocPosition: LocationState['hasGeolocPosition']
  onSubmit: LocationSubmit['onSubmit']
  tempLocationMode: LocationState['tempLocationMode']
}

export const useLocationMode = ({
  dismissModal,
  shouldOpenDirectlySettings,
  shouldDirectlyValidate,
  setTempLocationMode,
  setSelectedLocationMode,
  permissionState,
  setPlace,
  requestGeolocPermission,
  hasGeolocPosition,
  onSubmit,
}: Props) => {
  const { runGeolocationDialogs } = useGeolocationDialogs({
    dismissModal,
    shouldOpenDirectlySettings,
    shouldDirectlyValidate,
    setTempLocationMode,
    setSelectedLocationMode,
    permissionState,
    setPlace,
    requestGeolocPermission,
    hasGeolocPosition,
  })

  const selectLocationMode = (mode: LocationMode) => () => {
    switch (mode) {
      case LocationMode.AROUND_ME:
        runGeolocationDialogs()
        if (shouldDirectlyValidate) {
          dismissModal()
        }
        break

      case LocationMode.EVERYWHERE:
        setTempLocationMode(LocationMode.EVERYWHERE)
        if (shouldDirectlyValidate) {
          setSelectedLocationMode(LocationMode.EVERYWHERE)
          setPlace(null)
          dismissModal()
        } else {
          onSubmit(LocationMode.EVERYWHERE)
        }
        break

      default:
        setTempLocationMode(mode)
        break
    }
  }

  return { selectLocationMode }
}
