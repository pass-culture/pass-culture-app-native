import { homeNavigateConfig } from 'features/navigation/helpers'
import { isTimestampExpired } from 'libs/dates'

import { DeepLinksToScreenConfiguration } from './types'

const config: DeepLinksToScreenConfiguration = {
  default() {
    return homeNavigateConfig
  },
  favoris() {
    return { screen: 'Favorites', params: undefined }
  },
  login() {
    return { screen: 'Login', params: undefined }
  },
  'set-email'() {
    return { screen: 'SetEmail', params: undefined }
  },
  'mot-de-passe-perdu'(params) {
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
          expiration_timestamp: params.expiration_timestamp,
        },
      }
    }
    return homeNavigateConfig
  },
  offer: (params) => {
    return { screen: 'Offer', params: { id: params ? +params.id : 0 } }
  },
  profil() {
    return { screen: 'Profile', params: undefined }
  },
  recherche() {
    return { screen: 'Search', params: undefined }
  },
  'signup-confirmation'(params) {
    if (params && params.token && params.email && params.expiration_timestamp) {
      return {
        screen: 'AfterSignupEmailValidationBuffer',
        params: {
          email: params.email,
          token: params.token,
          expirationTimestamp: Number(params.expiration_timestamp),
        },
      }
    }
    return homeNavigateConfig
  },
  'id-check'(params) {
    if (params?.email && params?.licenceToken) {
      return {
        screen: 'IdCheck',
        params: {
          email: params.email,
          licenceToken: params.licenceToken,
        },
      }
    }
    return homeNavigateConfig
  },
}

function encodeConfigURIParameters(config: DeepLinksToScreenConfiguration) {
  const finalConfig = {}
  Object.keys(config).forEach((key) => {
    finalConfig[key] = (params) => {
      const screenConfig = config[key](params)
      if (screenConfig?.params) {
        const encodedParams = {}
        Object.keys(screenConfig.params).forEach((name) => {
          encodedParams[name] = encodeURIComponent(screenConfig.params[name])
        })
        screenConfig.params = encodedParams
      }
    }
  })
  return finalConfig
}
export const DEEPLINK_TO_SCREEN_CONFIGURATION = encodeConfigURIParameters(config)
