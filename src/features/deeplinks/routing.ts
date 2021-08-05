import { homeNavigateConfig } from 'features/navigation/helpers'
import { screenParamsParser } from 'features/navigation/screenParamsParser'

import { DeepLinksToScreenConfiguration } from './types'

export const DEEPLINK_TO_SCREEN_CONFIGURATION: DeepLinksToScreenConfiguration = {
  default() {
    return homeNavigateConfig
  },
  home: (params) => {
    if (params?.entryId) {
      return {
        screen: 'TabNavigator',
        params: {
          screen: 'Home',
          params: { entryId: params.entryId },
        },
      }
    }
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
    const screen = 'ReinitializePassword'
    const parser = screenParamsParser[screen]
    if (params && params.token && params.email && params.expiration_timestamp) {
      return {
        screen,
        params: {
          email: parser.email(params.email),
          token: parser.token(params.token),
          expiration_timestamp: parser.expiration_timestamp(params.expiration_timestamp),
        },
      }
    }
    return homeNavigateConfig
  },
  offer: (params) => {
    return {
      screen: 'Offer',
      params: {
        id: params?.id ? Number(params.id) : 0,
        from: 'deeplink',
      },
    }
  },
  profil() {
    return { screen: 'Profile', params: undefined }
  },
  recherche() {
    return { screen: 'Search', params: undefined }
  },
  venue: (params) => {
    return {
      screen: 'Venue',
      params: {
        id: params?.id ? Number(params.id) : 0,
      },
    }
  },
  'signup-confirmation'(params) {
    const screen = 'AfterSignupEmailValidationBuffer'
    const parser = screenParamsParser[screen]
    if (params && params.token && params.email && params.expiration_timestamp) {
      return {
        screen,
        params: {
          email: parser.email(params.email),
          token: parser.token(params.token),
          expiration_timestamp: parser.expiration_timestamp(params.expiration_timestamp),
        },
      }
    }
    return homeNavigateConfig
  },
  'id-check'(params) {
    if (params?.email?.includes('@')) {
      return {
        screen: 'Login',
        params: {
          follow: {
            screen: 'NextBeneficiaryStep',
          },
        },
      }
    }
    return homeNavigateConfig
  },
}
