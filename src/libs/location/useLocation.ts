import { UseLocationReturnType, LocationMode } from 'libs/location/types'
import {
  locationActions,
  useIsGeolocated,
  useLocationConfiguration,
  useLocationV2,
  usePlace,
  useUserLocation,
} from 'libs/locationV2/location.store'
import { locationModalActions } from 'libs/locationV2/locationModal.store'

/**
 * @deprecated Use {@link libs/locationV2/location.store}, {@link libs/locationV2/locationModal.store}, {@link libs/locationV2/location.methods} instead
 */

export const useLocation = (): UseLocationReturnType => {
  const { locationMode: selectedLocationMode } = useLocationV2()

  const hasGeolocPosition = useIsGeolocated()
  const { permissionState, geolocationError: geolocPositionError } = useLocationV2()
  const { geolocation: geolocPosition } = useLocationConfiguration(LocationMode.AROUND_ME)

  const place = usePlace()
  const { setPlace, showPermissionModal: showGeolocPermissionModal } = locationActions

  const userLocation = useUserLocation()

  return {
    geolocPosition,
    geolocPositionError,
    permissionState,
    hasGeolocPosition,
    place,
    setPlace,
    showGeolocPermissionModal,
    selectedLocationMode,
    setSelectedLocationMode: locationActions.setLocationMode,
    onResetPlace: locationModalActions.resetPlace,
    selectedPlace: place,
    setSelectedPlace: locationModalActions.setPlace,
    setPlaceQuery: locationModalActions.setAddressInputValue,
    userLocation,
  }
}
