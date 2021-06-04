import { t } from '@lingui/macro'
import { Dispatch, SetStateAction } from 'react'
import AgonTukGeolocation, { GeoCoordinates, PositionError } from 'react-native-geolocation-service'

import { MonitoringError } from 'libs/errorMonitoring'

const GET_POSITION_SETTINGS = {
  enableHighAccuracy: false,
  timeout: 20000,
  maximumAge: 10000,
  showLocationDialog: false,
  forceRequestLocation: false,
}

export const GEOLOCATION_USER_ERROR_MESSAGE: Record<PositionError, string> = {
  [PositionError.PERMISSION_DENIED]: t`La géolocalisation est désactivée sur l'application`,
  [PositionError.POSITION_UNAVAILABLE]: t`La géolocalisation est temporairement inutilisable`,
  [PositionError.TIMEOUT]: t`La géolocalisation est temporairement inutilisable`,
  [PositionError.PLAY_SERVICE_NOT_AVAILABLE]: t`L'absence des services Google Play bloquent possiblement la géolocalisation`,
  [PositionError.SETTINGS_NOT_SATISFIED]: t`Les réglages de ton téléphone ne nous permettent pas d’utiliser la géolocalisation`,
  [PositionError.INTERNAL_ERROR]: t`La géolocalisation est temporairement inutilisable`,
}

export type GeolocationError = {
  type: PositionError
  message: string
}

export const getPosition = (
  setPosition: Dispatch<SetStateAction<GeoCoordinates | null>>,
  setPositionError: Dispatch<SetStateAction<GeolocationError | null>>
): void =>
  AgonTukGeolocation.getCurrentPosition(
    (position) => {
      setPositionError(null)
      setPosition(position.coords)
    },
    ({ code, message }) => {
      switch (code) {
        case PositionError.PERMISSION_DENIED:
          setPositionError(null)
          setPosition(null)
          break
        case PositionError.POSITION_UNAVAILABLE:
          // since we don't know if the previous request was successful
          // we do nothing to avoid side effects with existing features
          setPositionError({ type: code, message: GEOLOCATION_USER_ERROR_MESSAGE[code] })
          new MonitoringError(message, 'PositionError_PositionUnavailable')
          break
        case PositionError.TIMEOUT:
          // TODO: we could implement a retry pattern if we got time ??
          setPositionError({ type: code, message: GEOLOCATION_USER_ERROR_MESSAGE[code] })
          setPosition(null)
          new MonitoringError(message, 'PositionError_Timeout')
          break
        case PositionError.PLAY_SERVICE_NOT_AVAILABLE:
          setPositionError({ type: code, message: GEOLOCATION_USER_ERROR_MESSAGE[code] })
          setPosition(null)
          new MonitoringError(message, 'PositionError_PlayServiceNotAvailable')
          break
        case PositionError.SETTINGS_NOT_SATISFIED:
          // global localisation parameter setting is off
          // OR network is off
          // OR offline id on
          setPositionError({ type: code, message: GEOLOCATION_USER_ERROR_MESSAGE[code] })
          setPosition(null)
          new MonitoringError(message, 'PositionError_SettingsNotSatisfied')
          break
        case PositionError.INTERNAL_ERROR:
          setPositionError({ type: code, message: GEOLOCATION_USER_ERROR_MESSAGE[code] })
          setPosition(null)
          new MonitoringError(message, 'PositionError_InternalError')
          break
      }
    },
    GET_POSITION_SETTINGS
  )
