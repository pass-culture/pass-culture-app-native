import { geolocalisationContext } from 'libs/geolocation/fixtures/geolocationContext'

export const useGeolocation = jest.fn(() => geolocalisationContext)

export enum GeolocPermissionState {
  GRANTED = 'granted',
  DENIED = 'denied',
  NEVER_ASK_AGAIN = 'never_ask_again',
}
