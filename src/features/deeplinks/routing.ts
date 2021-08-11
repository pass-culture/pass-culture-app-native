import { homeNavigateConfig } from 'features/navigation/helpers'
import { screenParamsParser } from 'features/navigation/screenParamsUtils'

import { DeepLinksToScreenConfiguration } from './types'

export const DEEPLINK_TO_SCREEN_CONFIGURATION: DeepLinksToScreenConfiguration = {
  default() {
    return homeNavigateConfig
  },
  home: (params) => {
    const screen = 'Home'
    const parser = screenParamsParser[screen]
    if (params?.entryId) {
      return {
        screen: 'TabNavigator',
        params: {
          screen,
          params: { entryId: parser.entryId(params.entryId) },
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
    const screen = 'Offer'
    const parser = screenParamsParser[screen]
    return {
      screen,
      params: {
        id: parser.id(params.id),
        from: parser.from('deeplink'),
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
    const screen = 'Venue'
    const parser = screenParamsParser[screen]
    return {
      screen,
      params: {
        id: parser.id(params.id),
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
  'id-check'() {
    const screen = 'Login'
    const parser = screenParamsParser[screen]
    return {
      screen,
      params: {
        followScreen: parser.followScreen('NextBeneficiaryStep'),
      },
    }
  },
}
