import { AllNavParamList } from 'features/navigation/RootNavigator'
import { isTimestampExpired } from 'libs/dates'

import { DeepLinksToScreenConfiguration, DeepLinksToScreenMap } from './types'

export const DEEPLINK_TO_SCREEN_CONFIGURATION: DeepLinksToScreenConfiguration<
  DeepLinksToScreenMap,
  AllNavParamList
> = {
  'mot-de-passe-perdu': function (params) {
    if (params && params.token && params.expiration_timestamp) {
      const parsedExpirationTimestamp = Number(params.expiration_timestamp)
      if (isTimestampExpired(parsedExpirationTimestamp)) {
        return {
          screen: 'ResetPasswordExpiredLink',
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
    return { screen: 'Home' }
  },
  profil: function () {
    return { screen: 'Profile' }
  },
  favoris: function () {
    return { screen: 'Favorites' }
  },
  recherche: function () {
    return { screen: 'Search' }
  },
  login: function () {
    return { screen: 'Login' }
  },
  default: function () {
    return { screen: 'Home' }
  },
}
