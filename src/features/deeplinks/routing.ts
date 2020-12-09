import { isTimestampExpired } from 'libs/dates'

import { DeepLinksToScreenConfiguration } from './types'

export const DEEPLINK_TO_SCREEN_CONFIGURATION: DeepLinksToScreenConfiguration = {
  default: function () {
    return { screen: 'Home', params: { shouldDisplayLoginModal: false } }
  },
  'email-confirmation': function (params) {
    const parsedExpirationTimestamp = Number(params?.expiration_timestamp)
    if (isTimestampExpired(parsedExpirationTimestamp) || !params?.token) {
      throw new Error('To be implemented in https://passculture.atlassian.net/browse/PC-5139 ')
    }

    return {
      screen: 'SignupEmailValidation',
      params: {
        token: params.token,
        expiration_timestamp: parsedExpirationTimestamp,
      },
    }
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
      if (isTimestampExpired(parsedExpirationTimestamp)) {
        return {
          screen: 'ResetPasswordExpiredLink',
          params: { email: params.email },
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
    return { screen: 'Home', params: { shouldDisplayLoginModal: false } }
  },
  offer: function (params) {
    return { screen: 'Offer', params: { id: params ? params.id : '' } }
  },
  profil: function () {
    return { screen: 'Profile', params: undefined }
  },
  recherche: function () {
    return { screen: 'Search', params: undefined }
  },
}
