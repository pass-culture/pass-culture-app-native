import { useGeolocation as actualUseGeolocation } from 'libs/geolocation'

export function useGeolocation(): ReturnType<typeof actualUseGeolocation> {
  return {
    latitude: 90,
    longitude: 90,
    accuracy: 1,
    altitude: null,
    heading: null,
    speed: null,
    altitudeAccuracy: null,
  }
}

export default useGeolocation
