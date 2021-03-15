import AgonTukGeolocation, { GeoCoordinates, PositionError } from 'react-native-geolocation-service'

export const getPosition = (
  setInitialPosition: (coordinates: GeoCoordinates | null) => void
): void =>
  AgonTukGeolocation.getCurrentPosition(
    (position) => setInitialPosition(position.coords),
    ({ code }) => {
      switch (code) {
        case PositionError.PERMISSION_DENIED:
          // impossible since this method is call only if the permission is "granted"
          break
        case PositionError.POSITION_UNAVAILABLE:
          // since we don't know if the previous request was successful
          // we do nothing to avoid side effects with existing features
          break
        case PositionError.TIMEOUT:
          // TODO: we could implement a retry pattern if we got time ??
          setInitialPosition(null)
          break
        case PositionError.PLAY_SERVICE_NOT_AVAILABLE:
          setInitialPosition(null)
          break
        case PositionError.SETTINGS_NOT_SATISFIED:
          // global localisation parameter setting is off
          // OR network is off
          // OR offline id on
          setInitialPosition(null)
          break
        case PositionError.INTERNAL_ERROR:
          setInitialPosition(null)
          break
      }
    },
    { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000, showLocationDialog: true }
  )
