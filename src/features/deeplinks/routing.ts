import { homeNavigateConfig } from 'features/navigation/helpers'
import { isTimestampExpired } from 'libs/dates'

import { DeepLinksToScreenConfiguration } from './types'

export const DEEPLINK_TO_SCREEN_CONFIGURATION: DeepLinksToScreenConfiguration = {
  default: function () {
    return homeNavigateConfig
  },
  favoris: function () {
    return { screen: 'Favorites', params: undefined }
  },
  login: function () {
    return { screen: 'Login', params: undefined }
  },
  'set-email': function () {
    return { screen: 'SetEmail', params: undefined }
  },
  'mot-de-passe-perdu': function (params) {
    if (params && params.token && params.email && params.expiration_timestamp) {
      const parsedExpirationTimestamp = Number(params.expiration_timestamp)
      const parsedEmail = decodeURIComponent(params.email)
      if (isTimestampExpired(parsedExpirationTimestamp)) {
        return {
          screen: 'ResetPasswordExpiredLink',
          params: { email: parsedEmail },
        }
      }
      return {
        screen: 'ReinitializePassword',
        params: {
          token: params.token,
          expiration_timestamp: parsedExpirationTimestamp,
        },
      }
    }
    return homeNavigateConfig
  },
  offer: function (params) {
    return { screen: 'Offer', params: { id: params ? +params.id : 0 } }
  },
  profil: function () {
    return { screen: 'Profile', params: undefined }
  },
  recherche: function () {
    return { screen: 'Search', params: undefined }
  },
  'signup-confirmation': function (params) {
    if (params && params.token && params.email && params.expiration_timestamp) {
      const parsedEmail = decodeURIComponent(params.email)
      return {
        screen: 'AfterSignupEmailValidationBuffer',
        params: {
          email: parsedEmail,
          token: params.token,
          expirationTimestamp: Number(params.expiration_timestamp),
        },
      }
    }
    return homeNavigateConfig
  },
}
