export enum GeolocPermissionState {
  GRANTED = 'granted',
  DENIED = 'denied',
  NEVER_ASK_AGAIN = 'never_ask_again',
  NEED_ASK_POSITION_DIRECTLY = 'need_ask_position_directly', // web only
}

export enum GeolocPositionError {
  PERMISSION_DENIED = 'permission_denied',
  POSITION_UNAVAILABLE = 'position_unavailable',
  TIMEOUT = 'timeout',
  PLAY_SERVICE_NOT_AVAILABLE = 'play_service_not_available', // native only
  SETTINGS_NOT_SATISFIED = 'settings_not_satisfied', // native only
  INTERNAL_ERROR = 'internal_error', // native only
}

export const GEOLOCATION_USER_ERROR_MESSAGE: Record<GeolocPositionError, string> = {
  [GeolocPositionError.PERMISSION_DENIED]: 'La géolocalisation est désactivée sur l’application',
  [GeolocPositionError.POSITION_UNAVAILABLE]: 'La géolocalisation est temporairement inutilisable',
  [GeolocPositionError.TIMEOUT]: 'La géolocalisation est temporairement inutilisable',
  [GeolocPositionError.PLAY_SERVICE_NOT_AVAILABLE]:
    'L’absence des services Google Play bloquent possiblement la géolocalisation',
  [GeolocPositionError.SETTINGS_NOT_SATISFIED]:
    'Les réglages de ton téléphone ne nous permettent pas d’utiliser la géolocalisation',
  [GeolocPositionError.INTERNAL_ERROR]: 'La géolocalisation est temporairement inutilisable',
}
