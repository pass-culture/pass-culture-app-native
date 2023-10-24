import { Alert, Linking, Platform, NativeModules } from 'react-native'

import * as getScreenFromDeeplinkModule from 'features/deeplinks/helpers/getScreenFromDeeplink'
import { DeeplinkParts } from 'features/deeplinks/types'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { getScreenPath } from 'features/navigation/RootNavigator/linking/getScreenPath'
import { analytics } from 'libs/analytics'
import { eventMonitoring } from 'libs/monitoring'
import { act } from 'tests/utils'

import { openUrl } from '../helpers'

jest.mock('features/navigation/navigationRef')
jest.mock('features/navigation/RootNavigator/linking')

const openURLSpy = jest.spyOn(Linking, 'openURL')

const getScreenFromDeeplinkModuleSpy = jest.spyOn(
  getScreenFromDeeplinkModule,
  'getScreenFromDeeplink'
)

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native')
  // jest does not have access to NativeModules, so we need to mock them
  RN.NativeModules.DefaultBrowserModule = { openUrl: jest.fn() }

  return RN
})

describe('openUrl', () => {
  afterEach(() => {
    openURLSpy.mockReset()
    // ios is the default value for native tests
    Platform.OS = 'ios'
  })

  describe('ExternalUrl', () => {
    it('should open links on browser using custom module on Android', async () => {
      Platform.OS = 'android'

      const link = 'https://www.google.com'
      await openUrl(link)
      await act(() => {})

      expect(NativeModules.DefaultBrowserModule.openUrl).toHaveBeenCalledWith(link)
    })

    it('should open links on browser using Linking when url is invalid on Android', async () => {
      Platform.OS = 'android'
      const openURL = openURLSpy.mockResolvedValueOnce(undefined)

      const invalidLink = 'abcdef'
      await openUrl(invalidLink)

      expect(openURL).toHaveBeenCalledWith(invalidLink)
    })

    it('should open links with Linking on iOS', async () => {
      const openURL = openURLSpy.mockResolvedValueOnce(undefined)

      const link = 'https://www.google.com'
      await openUrl(link)

      expect(openURL).toHaveBeenCalledWith(link)
    })
  })

  describe('InApp screen', () => {
    it('should navigate to in-app screen (ex: Offer)', async () => {
      const openURL = openURLSpy.mockResolvedValueOnce(undefined)
      getScreenFromDeeplinkModuleSpy.mockImplementationOnce(
        () => ({ screen: 'Offer', params: { id: 1, from: 'offer' } } as DeeplinkParts)
      )
      const path = getScreenPath('Offer', { id: 1, from: 'offer', moduleName: undefined })

      const link = 'https://mockValidPrefix1' + `/${path}`
      await openUrl(link)

      expect(openURL).not.toHaveBeenCalled()
      expect(navigateFromRef).toHaveBeenCalledWith('Offer', { id: 1, from: 'offer' })
    })

    it('should navigate to external screen even when screen is in-app when isExternal is true (ex: Offer)', async () => {
      const openURL = openURLSpy.mockResolvedValueOnce(undefined)
      const path = getScreenPath('Offer', { id: 1, from: 'offer', moduleName: undefined })

      const link = 'https://mockValidPrefix1' + `/${path}`
      await openUrl(link, undefined, true)

      expect(navigateFromRef).not.toHaveBeenCalled()
      expect(openURL).toHaveBeenCalledWith(link)
    })

    it('should navigate to PageNotFound when in-app screen cannot be found (ex: Offer)', async () => {
      const openURL = openURLSpy.mockResolvedValueOnce(undefined)
      getScreenFromDeeplinkModuleSpy.mockImplementationOnce(
        () => ({ screen: 'PageNotFound', params: undefined } as DeeplinkParts)
      )

      const link = 'https://mockValidPrefix2' + '/unknown'
      await openUrl(link)

      expect(openURL).not.toHaveBeenCalled()
      expect(navigateFromRef).toHaveBeenCalledWith('PageNotFound', undefined)
    })
  })

  describe('Analytics', () => {
    it('should log analytics when shouldLogEvent is true (default behavior)', async () => {
      openURLSpy.mockResolvedValueOnce(undefined)

      const link = 'https://www.google.com'
      await openUrl(link)

      await act(async () => {})

      expect(analytics.logOpenExternalUrl).toHaveBeenCalledWith(link, {})
    })

    it('should not log analytics event when shouldLogEvent is false', async () => {
      openURLSpy.mockResolvedValueOnce(undefined)

      const link = 'https://www.google.com'
      await openUrl(link, { shouldLogEvent: false })

      expect(analytics.logOpenExternalUrl).not.toHaveBeenCalled()
    })
  })

  describe('Sentry', () => {
    it('should log an info in Sentry when Linking.openURL throws', async () => {
      openURLSpy.mockImplementationOnce(() => Promise.reject(new Error('Did not open correctly')))

      const link = 'https://www.google.com'
      await openUrl(link)

      expect(eventMonitoring.captureMessage).toHaveBeenNthCalledWith(
        1,
        'OpenExternalUrlError: Did not open correctly',
        'info'
      )
    })

    it('should log an info in Sentry when Linking.openURL throws and fallbackUrl throws', async () => {
      openURLSpy.mockImplementationOnce(() => Promise.reject(new Error('Did not open correctly')))
      openURLSpy.mockImplementationOnce(() => Promise.reject(new Error('Did not open correctly')))

      const link = 'https://www.google.com'
      const fallbackLink = 'https://www.googlefallback.com'
      await openUrl(link, { fallbackUrl: fallbackLink })
      await act(async () => {})

      expect(eventMonitoring.captureMessage).toHaveBeenNthCalledWith(
        1,
        'OpenExternalUrlError: Did not open correctly',
        'info'
      )
      expect(eventMonitoring.captureMessage).toHaveBeenNthCalledWith(
        2,
        'OpenExternalUrlError_FallbackUrl: Did not open correctly',
        'info'
      )
    })
  })

  describe('Alert prompt', () => {
    it('should display alert when Linking.openURL throws', async () => {
      openURLSpy.mockImplementationOnce(() => Promise.reject(new Error('Did not open correctly')))
      const alertMock = jest.spyOn(Alert, 'alert')

      const link = 'https://www.google.com'
      await openUrl(link)

      expect(alertMock).toHaveBeenCalledTimes(1)
    })

    it('should not display alert when Linking.openURL throws but fallbackUrl is valid', async () => {
      // Last in first out, it will fail then succeed.
      openURLSpy.mockResolvedValueOnce(undefined)
      openURLSpy.mockImplementationOnce(() => Promise.reject(new Error('Did not open correctly')))
      const alertMock = jest.spyOn(Alert, 'alert')

      const link = 'https://www.google.com'
      const fallbackLink = 'https://www.googlefallback.com'
      await openUrl(link, { fallbackUrl: fallbackLink })

      expect(alertMock).not.toHaveBeenCalled()
    })
  })
})
