import { Alert, Linking, NativeModules, Platform } from 'react-native'

import * as getScreenFromDeeplinkModule from 'features/deeplinks/helpers/getScreenFromDeeplink'
import { DeeplinkParts } from 'features/deeplinks/types'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { getScreenPath } from 'features/navigation/navigators/RootNavigator/linking/getScreenPath'
import { analytics } from 'libs/analytics/provider'
import { eventMonitoring } from 'libs/monitoring/services'
import { act } from 'tests/utils'

jest.mock('libs/monitoring/services')
jest.mock('features/navigation/navigationRef')
jest.mock('features/navigation/navigators/RootNavigator/linking/linking')
jest.mock('libs/firebase/analytics/analytics')

const openURLSpy = jest.spyOn(Linking, 'openURL')
const canOpenURLSpy = jest.spyOn(Linking, 'canOpenURL')
const mockDefaultBrowserOpenUrl = jest.spyOn(NativeModules.DefaultBrowserModule, 'openUrl')

const getScreenFromDeeplinkModuleSpy = jest.spyOn(
  getScreenFromDeeplinkModule,
  'getScreenFromDeeplink'
)

describe('openUrl', () => {
  afterEach(() => {
    mockDefaultBrowserOpenUrl.mockReset()
    openURLSpy.mockReset()
    canOpenURLSpy.mockReset()
    // ios is the default value for native tests
    Platform.OS = 'ios'
  })

  describe('ExternalUrl', () => {
    it('should open links on browser using custom module on Android', async () => {
      Platform.OS = 'android'
      canOpenURLSpy.mockResolvedValueOnce(true)

      const link = 'https://www.google.com'
      await openUrl(link)
      await act(() => {})

      expect(mockDefaultBrowserOpenUrl).toHaveBeenCalledWith(link)
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
        () =>
          ({
            screen: 'Offer',
            params: { id: 1, from: 'offer' },
          }) as DeeplinkParts
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
        () =>
          ({
            screen: 'PageNotFound',
            params: undefined,
          }) as DeeplinkParts
      )

      const link = 'https://mockValidPrefix2' + '/unknown'
      await openUrl(link)

      expect(openURL).not.toHaveBeenCalled()
      expect(navigateFromRef).toHaveBeenCalledWith('PageNotFound', undefined)
    })

    it('should log to sentry and navigate to the home when there is an error', async () => {
      const openURL = openURLSpy.mockResolvedValueOnce(undefined)
      getScreenFromDeeplinkModuleSpy.mockImplementationOnce(() => {
        throw new Error('Nope')
      })

      const link = 'https://mockValidPrefix2' + '/unknown'
      await openUrl(link)

      expect(openURL).not.toHaveBeenCalled()
      expect(navigateFromRef).toHaveBeenCalledWith('TabNavigator', {
        params: undefined,
        screen: 'Home',
      })
      expect(eventMonitoring.captureException).toHaveBeenCalledWith(new Error('Nope'))
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

  describe('Alert prompt', () => {
    it('should display alert, log once and rethrow when Linking.openURL throws', async () => {
      const error = new Error('Did not open correctly')
      openURLSpy.mockRejectedValueOnce(error)
      const alertMock = jest.spyOn(Alert, 'alert')

      const link = 'https://www.google.com'

      await expect(openUrl(link)).rejects.toBe(error)

      expect(alertMock).toHaveBeenCalledTimes(1)
      expect(eventMonitoring.captureException).toHaveBeenCalledTimes(1)
      expect(eventMonitoring.captureException).toHaveBeenCalledWith(error)
    })

    it('should not display alert when Linking.openURL throws but fallbackUrl is valid', async () => {
      openURLSpy
        .mockRejectedValueOnce(new Error('Did not open correctly'))
        .mockResolvedValueOnce(undefined)
      const alertMock = jest.spyOn(Alert, 'alert')

      const link = 'https://www.google.com'
      const fallbackLink = 'https://www.googlefallback.com'
      await openUrl(link, { fallbackUrl: fallbackLink })

      expect(alertMock).not.toHaveBeenCalled()
      expect(openURLSpy).toHaveBeenNthCalledWith(2, fallbackLink)
      expect(eventMonitoring.captureException).not.toHaveBeenCalled()
    })

    it('should display alert, log once and rethrow when the fallback also fails', async () => {
      const error = new Error('Fallback did not open correctly')
      openURLSpy
        .mockRejectedValueOnce(new Error('Did not open correctly'))
        .mockRejectedValueOnce(error)
      const alertMock = jest.spyOn(Alert, 'alert')

      await expect(
        openUrl('https://www.google.com', { fallbackUrl: 'https://www.googlefallback.com' })
      ).rejects.toBe(error)

      expect(alertMock).toHaveBeenCalledTimes(1)
      expect(eventMonitoring.captureException).toHaveBeenCalledTimes(1)
      expect(eventMonitoring.captureException).toHaveBeenCalledWith(error)
    })
  })
})
