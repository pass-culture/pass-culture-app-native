import * as datesLib from 'libs/dates'

import { DEEPLINK_TO_SCREEN_CONFIGURATION } from './routing'

describe('DEEPLINK_TO_SCREEN_CONFIGURATION', () => {
  describe('link mot-de-passe-perdu', () => {
    it('should return Home page when no params are passed', () => {
      const configureScreen = DEEPLINK_TO_SCREEN_CONFIGURATION['mot-de-passe-perdu']()
      expect(configureScreen.screen).toBe('Home')
      expect(configureScreen.params).toEqual({ shouldDisplayLoginModal: false })
    })

    it.each`
      params
      ${{ tok: '', expiration_timestamp: '', email: '' }}
      ${{ token: '', expiration_time: '', email: '' }}
      ${{ token: '', expiration_timestamp: '', em: '' }}
    `('should return Home page when params are invalid', ({ params }) => {
      const configureScreen = DEEPLINK_TO_SCREEN_CONFIGURATION['mot-de-passe-perdu'](params)
      expect(configureScreen.screen).toBe('Home')
      expect(configureScreen.params).toEqual({ shouldDisplayLoginModal: false })
    })

    it('should return ResetPasswordExpiredLink page when expiration_timestamp is expired', () => {
      jest.spyOn(datesLib, 'isTimestampExpired').mockReturnValue(true)
      const params = { token: 'token', expiration_timestamp: '11111', email: 'test@gmail.com' }
      const configureScreen = DEEPLINK_TO_SCREEN_CONFIGURATION['mot-de-passe-perdu'](params)

      expect(configureScreen.screen).toBe('ResetPasswordExpiredLink')
      expect(configureScreen.params).toEqual({ email: params.email })
    })

    it('should return ReinitializePassword page when expiration_timestamp is NOT expired', () => {
      jest.spyOn(datesLib, 'isTimestampExpired').mockReturnValue(false)
      const params = { token: 'token', expiration_timestamp: '11111', email: 'test@gmail.com' }
      const configureScreen = DEEPLINK_TO_SCREEN_CONFIGURATION['mot-de-passe-perdu'](params)

      expect(configureScreen.screen).toBe('ReinitializePassword')
      expect(configureScreen.params).toEqual({ token: params.token, expiration_timestamp: 11111 })
    })
  })

  describe('link default', () => {
    it('should return Home page when no params are passed', () => {
      const configureScreen = DEEPLINK_TO_SCREEN_CONFIGURATION['default']()
      expect(configureScreen.screen).toBe('Home')
      expect(configureScreen.params).toEqual({ shouldDisplayLoginModal: false })
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
})
