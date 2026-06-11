import { UseLocationReturnType, LocationMode } from 'libs/location/types'
import {
  contextualRequestGeolocPermission,
  onPressGeolocPermissionModalButton,
} from 'libs/locationV2/location.methods'
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
  const { geolocation: geolocPosition, radius: aroundMeRadius } = useLocationConfiguration(
    LocationMode.AROUND_ME
  )

  const { radius: aroundPlaceRadius } = useLocationConfiguration(LocationMode.AROUND_PLACE)
  const place = usePlace()
  const {
    setPlace,
    setAroundPlaceRadius,
    setAroundMeRadius,
    showPermissionModal: showGeolocPermissionModal,
  } = locationActions

  const onResetPlace = () => {
    locationModalActions.setPlace(null)
    locationModalActions.setAddressInputValue('')
  }

  const userLocation = useUserLocation()

  return {
    geolocPosition,
    geolocPositionError,
    permissionState,
    hasGeolocPosition,
    requestGeolocPermission: contextualRequestGeolocPermission,
    onPressGeolocPermissionModalButton,
    place,
    setPlace,
    showGeolocPermissionModal,
    selectedLocationMode,
    setSelectedLocationMode: locationActions.setLocationMode,
    onResetPlace,
    selectedPlace: place,
    setSelectedPlace: locationModalActions.setPlace,
    setPlaceQuery: locationModalActions.setAddressInputValue,
    aroundPlaceRadius,
    setAroundPlaceRadius,
    aroundMeRadius,
    setAroundMeRadius,
    userLocation,
  }
}
