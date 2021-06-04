import { homeNavigateConfig } from 'features/navigation/helpers'
import * as datesLib from 'libs/dates'

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

    it('should return ResetPasswordExpiredLink page when expiration_timestamp is expired', () => {
      jest.spyOn(datesLib, 'isTimestampExpired').mockReturnValue(true)
      const params = { token: 'token', expiration_timestamp: '11111', email: 'test@gmail.com' }
      const configureScreen = DEEPLINK_TO_SCREEN_CONFIGURATION['mot-de-passe-perdu'](params)

      expect(configureScreen.screen).toBe('ResetPasswordExpiredLink')
      expect(configureScreen.params).toEqual({ email: params.email })
    })

    it('should return ResetPasswordExpiredLink with correctly parsed email', () => {
      const params = {
        token: 'token',
        expiration_timestamp: '11111',
        email: 'test%2Bk%40passculture.app',
      }
      const configureScreen = DEEPLINK_TO_SCREEN_CONFIGURATION['mot-de-passe-perdu'](params)

      expect(configureScreen.screen).toBe('ResetPasswordExpiredLink')
      expect(configureScreen.params).toEqual({ email: 'test+k@passculture.app' })
    })

    it('should return ReinitializePassword page when expiration_timestamp is NOT expired', () => {
      jest.spyOn(datesLib, 'isTimestampExpired').mockReturnValue(false)
      const params = { token: 'token', expiration_timestamp: '11111', email: 'test@gmail.com' }
      const configureScreen = DEEPLINK_TO_SCREEN_CONFIGURATION['mot-de-passe-perdu'](params)

      expect(configureScreen.screen).toBe('ReinitializePassword')
      expect(configureScreen.params).toEqual({ token: params.token, expiration_timestamp: 11111 })
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
        expirationTimestamp: 11111,
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
      expect(configureScreen.params).toBe(undefined)
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

  describe('link id-check', () => {
    it('should return Home page when no params are passed', () => {
      const configureScreen = DEEPLINK_TO_SCREEN_CONFIGURATION['id-check']()
      expect(configureScreen).toEqual(homeNavigateConfig)
    })

    it.each`
      params
      ${{ email: '', licenceToken: '' }}
      ${{ emai: 'data', licenceToken: '' }}
      ${{ email: 'data', licenceToke: 'data' }}
    `('should return Home page when params are invalid', ({ params }) => {
      const configureScreen = DEEPLINK_TO_SCREEN_CONFIGURATION['id-check'](params)
      expect(configureScreen).toEqual(homeNavigateConfig)
    })

    it('should return IdCheck page when email and licenseToken are set', () => {
      const params = {
        email: 'user@site',
      }
      const configureScreen = DEEPLINK_TO_SCREEN_CONFIGURATION['id-check'](params)

      expect(configureScreen.screen).toBe('Login')
      expect(configureScreen.params).toEqual({
        follow: {
          screen: 'IdCheck',
          params: {
            email: 'user@site',
          },
        },
      })
    })
  })
})
