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
  recherche(params) {
    const screen = 'Search'
    const parser = screenParamsParser[screen]
    return {
      screen,
      params: {
        aroundRadius: params?.aroundRadius ? parser.aroundRadius(params.aroundRadius) : undefined,
        beginningDatetime: params?.beginningDatetime
          ? parser.beginningDatetime(params.beginningDatetime)
          : undefined,
        date: params?.date ? parser.date(params.date) : undefined,
        endingDatetime: params?.endingDatetime
          ? parser.endingDatetime(params.endingDatetime)
          : undefined,
        geolocation: params?.geolocation ? parser.geolocation(params.geolocation) : undefined,
        hitsPerPage: params?.hitsPerPage ? parser.hitsPerPage(params.hitsPerPage) : undefined,
        locationType: params?.locationType ? parser.locationType(params.locationType) : undefined,
        offerCategories: params?.offerCategories
          ? parser.offerCategories(params.offerCategories)
          : undefined,
        offerIsDuo: params?.offerIsDuo ? parser.offerIsDuo(params.offerIsDuo) : undefined,
        offerIsFree: params?.offerIsFree ? parser.offerIsFree(params.offerIsFree) : undefined,
        offerIsNew: params?.offerIsNew ? parser.offerIsNew(params.offerIsNew) : undefined,
        offerTypes: params?.offerTypes ? parser.offerTypes(params.offerTypes) : undefined,
        place: params?.place ? parser.place(params.place) : undefined,
        priceRange: params?.priceRange ? parser.priceRange(params.priceRange) : undefined,
        query: params?.query ? parser.query(params.query) : undefined,
        showResults: params?.showResults ? parser.showResults(params.showResults) : undefined,
        tags: params?.tags ? parser.tags(params.tags) : undefined,
        timeRange: params?.timeRange ? parser.timeRange(params.timeRange) : undefined,
        venueId: params?.venueId ? parser.venueId(params.venueId) : undefined,
      },
    }
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
