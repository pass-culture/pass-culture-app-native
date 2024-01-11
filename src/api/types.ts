export const FAILED_TO_GET_REFRESH_TOKEN_ERROR = 'Erreur lors de la récupération du refresh token'
export const REFRESH_TOKEN_IS_EXPIRED_ERROR = 'Le refresh token est expiré'
export const UNKNOWN_ERROR_WHILE_REFRESHING_ACCESS_TOKEN =
  'Une erreur inconnue est survenue lors de la regénération de l’access token'
export type Result =
  | { result: string; error?: never }
  | {
      result?: never
      error:
        | typeof FAILED_TO_GET_REFRESH_TOKEN_ERROR
        | typeof REFRESH_TOKEN_IS_EXPIRED_ERROR
        | typeof UNKNOWN_ERROR_WHILE_REFRESHING_ACCESS_TOKEN
    }
