import { homeNavigateConfig } from 'features/navigation/helpers'
import { screenParamsStringifier } from 'features/navigation/screenParamsUtils'
import { DATE_FILTER_OPTIONS, LocationType } from 'features/search/enums'
import { SearchState } from 'features/search/types'

import { DEEPLINK_TO_SCREEN_CONFIGURATION } from './routing'

describe('DEEPLINK_TO_SCREEN_CONFIGURATION', () => {
  describe('link mot-de-passe-perdu', () => {
    it('should return Home page when no params are passed', () => {
      const configureScreen = DEEPLINK_TO_SCREEN_CONFIGURATION['mot-de-passe-perdu']()
      expect(configureScreen).toEqual(homeNavigateConfig)
    })

    it.each`
      params
      ${{ tok: '', expiration_timestamp: '', email: '' }}
      ${{ token: '', expiration_time: '', email: '' }}
      ${{ token: '', expiration_timestamp: '', em: '' }}
    `('should return Home page when params are invalid', ({ params }) => {
      const configureScreen = DEEPLINK_TO_SCREEN_CONFIGURATION['mot-de-passe-perdu'](params)
      expect(configureScreen).toEqual(homeNavigateConfig)
    })

    it('should return ReinitializePassword when all params are present', () => {
      const params = { token: 'token', expiration_timestamp: '11111', email: 'test@gmail.com' }
      const configureScreen = DEEPLINK_TO_SCREEN_CONFIGURATION['mot-de-passe-perdu'](params)
      expect(configureScreen.screen).toBe('ReinitializePassword')
      expect(configureScreen.params).toEqual({
        token: params.token,
        expiration_timestamp: 11111,
        email: 'test@gmail.com',
      })
    })
  })

  describe('link signup-confirmation', () => {
    it('should return Home page when no params are passed', () => {
      const configureScreen = DEEPLINK_TO_SCREEN_CONFIGURATION['signup-confirmation']()
      expect(configureScreen).toEqual(homeNavigateConfig)
    })

    it.each`
      params
      ${{ tok: '', expiration_timestamp: '', email: '' }}
      ${{ token: '', expiration_time: '', email: '' }}
      ${{ token: '', expiration_timestamp: '', em: '' }}
    `('should return Home page when params are invalid', ({ params }) => {
      const configureScreen = DEEPLINK_TO_SCREEN_CONFIGURATION['signup-confirmation'](params)
      expect(configureScreen).toEqual(homeNavigateConfig)
    })

    it('should return AfterSignupEmailValidationBuffer when all params are present', () => {
      const params = {
        token: 'token',
        expiration_timestamp: '11111',
        email: 'test%2Bk%40passculture.app',
      }
      const configureScreen = DEEPLINK_TO_SCREEN_CONFIGURATION['signup-confirmation'](params)
      expect(configureScreen.screen).toBe('AfterSignupEmailValidationBuffer')
      expect(configureScreen.params).toEqual({
        email: 'test+k@passculture.app',
        expiration_timestamp: 11111,
        token: params.token,
      })
    })
  })

  describe('link default', () => {
    it('should return Home page when no params are passed', () => {
      const configureScreen = DEEPLINK_TO_SCREEN_CONFIGURATION['default']()
      expect(configureScreen).toEqual(homeNavigateConfig)
    })
  })

  describe('link favoris', () => {
    it('should return Favorites page when no params are passed', () => {
      const configureScreen = DEEPLINK_TO_SCREEN_CONFIGURATION['favoris']()
      expect(configureScreen.screen).toBe('Favorites')
      expect(configureScreen.params).toBe(undefined)
    })
  })

  describe('link login', () => {
    it('should return Login page when no params are passed', () => {
      const configureScreen = DEEPLINK_TO_SCREEN_CONFIGURATION['login']()
      expect(configureScreen.screen).toBe('Login')
      expect(configureScreen.params).toBe(undefined)
    })
  })
  describe('link setEmail', () => {
    it('should return SetEmail page when no params are passed', () => {
      const configureScreen = DEEPLINK_TO_SCREEN_CONFIGURATION['set-email']()
      expect(configureScreen.screen).toBe('SetEmail')
      expect(configureScreen.params).toBe(undefined)
    })
  })

  describe('link profil', () => {
    it('should return Profile page when no params are passed', () => {
      const configureScreen = DEEPLINK_TO_SCREEN_CONFIGURATION['profil']()
      expect(configureScreen.screen).toBe('Profile')
      expect(configureScreen.params).toBe(undefined)
    })
  })

  describe('link recherche', () => {
    it('should return Search page when no params are passed', () => {
      const configureScreen = DEEPLINK_TO_SCREEN_CONFIGURATION['recherche']()
      expect(configureScreen.screen).toBe('Search')
      expect(configureScreen.params).toEqual({
        aroundRadius: undefined,
        beginningDatetime: undefined,
        date: undefined,
        endingDatetime: undefined,
        geolocation: undefined,
        hitsPerPage: undefined,
        locationType: undefined,
        offerCategories: undefined,
        offerIsDuo: undefined,
        offerIsFree: undefined,
        offerIsNew: undefined,
        offerTypes: undefined,
        place: undefined,
        priceRange: undefined,
        query: undefined,
        showResults: undefined,
        tags: undefined,
        timeRange: undefined,
        venueId: undefined,
      })
    })

    it('should return Search page when params are passed', () => {
      const screen = 'Search'
      const stringifier = screenParamsStringifier[screen]
      const searchState: SearchState = {
        aroundRadius: 100,
        beginningDatetime: new Date('2021-08-10T15:02:01.100Z'),
        date: {
          option: DATE_FILTER_OPTIONS.CURRENT_WEEK,
          selectedDate: new Date('2021-08-10T15:02:01.100Z'),
        },
        endingDatetime: new Date('2021-08-10T15:02:01.100Z'),
        geolocation: {
          latitude: 48.891304999999996,
          longitude: 2.3529866999999998,
        },
        hitsPerPage: 20,
        locationType: LocationType.AROUND_ME,
        offerCategories: [
          'CINEMA',
          'VISITE',
          'MUSIQUE',
          'SPECTACLE',
          'LIVRE',
          'LECON',
          'FILM',
          'JEUX_VIDEO',
          'PRESSE',
          'CONFERENCE',
          'INSTRUMENT',
          'MATERIEL_ART_CREA',
        ],
        offerIsDuo: false,
        offerIsFree: false,
        offerIsNew: true,
        offerTypes: {
          isDigital: true,
          isEvent: true,
          isThing: true,
        },
        place: {
          name: {
            long: 'Rue Victor Hugo, Bordeaux',
            short: 'Rue Victor Hugo',
          },
          extraData: {
            city: 'Bordeaux',
            department: 'Gironde',
          },
          geolocation: {
            longitude: -0.609124,
            latitude: 44.846721,
          },
        },
        priceRange: [100, 300],
        query: 'mars the biggest planet',
        showResults: false,
        tags: [],
        timeRange: [10, 24],
        venueId: 456445,
      }
      const configureScreen = DEEPLINK_TO_SCREEN_CONFIGURATION['recherche']({
        aroundRadius: stringifier.aroundRadius
          ? stringifier.aroundRadius(searchState.aroundRadius)
          : '',
        beginningDatetime: stringifier.beginningDatetime
          ? stringifier.beginningDatetime(searchState.beginningDatetime)
          : 'null',
        date: stringifier.date ? stringifier.date(searchState.date) : 'null',
        endingDatetime: stringifier.endingDatetime
          ? stringifier.endingDatetime(searchState.endingDatetime)
          : 'null',
        geolocation: stringifier.geolocation
          ? stringifier.geolocation(searchState.geolocation)
          : 'null',
        hitsPerPage: stringifier.hitsPerPage
          ? stringifier.hitsPerPage(searchState.hitsPerPage)
          : 'null',
        locationType: stringifier.locationType
          ? stringifier.locationType(searchState.locationType)
          : 'null',
        offerCategories: stringifier.offerCategories
          ? stringifier.offerCategories(searchState.offerCategories)
          : 'null',
        offerIsDuo: stringifier.offerIsDuo
          ? stringifier.offerIsDuo(searchState.offerIsDuo)
          : 'null',
        offerIsFree: stringifier.offerIsFree
          ? stringifier.offerIsFree(searchState.offerIsFree)
          : 'null',
        offerIsNew: stringifier.offerIsNew
          ? stringifier.offerIsNew(searchState.offerIsNew)
          : 'null',
        offerTypes: stringifier.offerTypes
          ? stringifier.offerTypes(searchState.offerTypes)
          : 'null',
        place: stringifier.place ? stringifier.place(searchState.place) : 'null',
        priceRange: stringifier.priceRange
          ? stringifier.priceRange(searchState.priceRange)
          : 'null',
        query: stringifier.query ? stringifier.query(searchState.query) : 'null',
        showResults: stringifier.showResults
          ? stringifier.showResults(searchState.showResults)
          : 'null',
        tags: stringifier.tags ? stringifier.tags(searchState.tags) : 'null',
        timeRange: stringifier.timeRange ? stringifier.timeRange(searchState.timeRange) : 'null',
        venueId: stringifier.venueId ? stringifier.venueId(searchState.venueId) : 'null',
      })
      expect(configureScreen.screen).toBe('Search')
      expect(configureScreen.params).toStrictEqual(searchState)
    })
  })

  describe('link offer', () => {
    it('should return Offer page with offer id as params', () => {
      const configureScreen = DEEPLINK_TO_SCREEN_CONFIGURATION['offer']({ id: '12345' })
      expect(configureScreen.screen).toBe('Offer')
      expect(configureScreen.params).toEqual({
        id: 12345,
        from: 'deeplink',
      })
    })
  })

  describe('link venue', () => {
    it('should return Venue page with offer id as params', () => {
      const configureScreen = DEEPLINK_TO_SCREEN_CONFIGURATION['venue']({ id: '12345' })
      expect(configureScreen.screen).toBe('Venue')
      expect(configureScreen.params).toEqual({
        id: 12345,
      })
    })
  })

  describe('link id-check', () => {
    it('should return IdCheck page when email and licenseToken are set', () => {
      const params = {
        email: 'user@site',
      }
      const configureScreen = DEEPLINK_TO_SCREEN_CONFIGURATION['id-check'](params)

      expect(configureScreen.screen).toBe('Login')
      expect(configureScreen.params).toEqual({
        followScreen: 'NextBeneficiaryStep',
      })
    })
  })
})
