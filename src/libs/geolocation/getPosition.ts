import { Dispatch, SetStateAction } from 'react'
import AgonTukGeolocation, { GeoCoordinates, PositionError } from 'react-native-geolocation-service'

import { MonitoringError } from 'libs/errorMonitoring'

export const getPosition = (
  setInitialPosition: (coordinates: GeoCoordinates | null) => void,
  setIsPositionUnavailable: Dispatch<SetStateAction<boolean>>
): void =>
  AgonTukGeolocation.getCurrentPosition(
    (position) => {
      setInitialPosition(position.coords)
    },
    ({ code }) => {
      switch (code) {
        case PositionError.PERMISSION_DENIED:
          setInitialPosition(null)
          break
        case PositionError.POSITION_UNAVAILABLE:
          // since we don't know if the previous request was successful
          // we do nothing to avoid side effects with existing features
          setIsPositionUnavailable(true)
          new MonitoringError(
            'AgonTukGeolocation.getCurrentPosition() - POSITION_UNAVAILABLE',
            'PositionError'
          )
          break
        case PositionError.TIMEOUT:
          // TODO: we could implement a retry pattern if we got time ??
          setIsPositionUnavailable(true)
          setInitialPosition(null)
          new MonitoringError('AgonTukGeolocation.getCurrentPosition() - TIMEOUT', 'PositionError')
          break
        case PositionError.PLAY_SERVICE_NOT_AVAILABLE:
          setIsPositionUnavailable(true)
          setInitialPosition(null)
          new MonitoringError(
            'AgonTukGeolocation.getCurrentPosition() - PLAY_SERVICE_NOT_AVAILABLE',
            'PositionError'
          )
          break
        case PositionError.SETTINGS_NOT_SATISFIED:
          // global localisation parameter setting is off
          // OR network is off
          // OR offline id on
          setIsPositionUnavailable(true)
          setInitialPosition(null)
          new MonitoringError(
            'AgonTukGeolocation.getCurrentPosition() - SETTINGS_NOT_SATISFIED',
            'PositionError'
          )
          break
        case PositionError.INTERNAL_ERROR:
          setIsPositionUnavailable(true)
          setInitialPosition(null)
          new MonitoringError(
            'AgonTukGeolocation.getCurrentPosition() - INTERNAL_ERROR',
            'PositionError'
          )
          break
      }
    },
    { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000, showLocationDialog: true }
  )
