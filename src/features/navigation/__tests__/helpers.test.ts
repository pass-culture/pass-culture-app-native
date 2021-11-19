import { Alert, Linking } from 'react-native'
import waitForExpect from 'wait-for-expect'

import * as getScreenFromDeeplinkModule from 'features/deeplinks/getScreenFromDeeplink'
import { DeeplinkParts } from 'features/deeplinks/types'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { getScreenPath } from 'features/navigation/RootNavigator/linking/getScreenPath'
import { analytics } from 'libs/analytics'

import { openUrl, navigateToBooking, isAppUrl } from '../helpers'

jest.mock('features/navigation/navigationRef')
jest.mock('features/navigation/RootNavigator/linking')

const getScreenFromDeeplinkModuleSpy = jest.spyOn(
  getScreenFromDeeplinkModule,
  'getScreenFromDeeplink'
)

const openURLSpy = jest.spyOn(Linking, 'openURL')

describe('Navigation helpers', () => {
  afterEach(() => {
    openURLSpy.mockReset()
  })

  it('should not capture links that doesnt start with the universal links domain', async () => {
    const openURL = openURLSpy.mockResolvedValueOnce(undefined)
    const link = 'https://www.google.com'
    await openUrl(link)
    expect(openURL).toBeCalledWith(link)
  })

  it('should navigate to in-app screen and navigate to it (ex: Offer)', async () => {
    const openURL = openURLSpy.mockResolvedValueOnce(undefined)
    getScreenFromDeeplinkModuleSpy.mockImplementationOnce(
      () => ({ screen: 'Offer', params: { id: 1, from: 'offer' } } as DeeplinkParts)
    )
    const path = getScreenPath('Offer', { id: 1, from: 'offer', moduleName: undefined })
    const link = 'https://mockValidPrefix1' + `/${path}`
    await openUrl(link)
    expect(openURL).not.toBeCalled()
    expect(navigateFromRef).toBeCalledWith('Offer', { id: 1, from: 'offer' })
  })

  it('should navigate to PageNotFound when in-app screen cannot be found (ex: Offer)', async () => {
    const openURL = openURLSpy.mockResolvedValueOnce(undefined)
    getScreenFromDeeplinkModuleSpy.mockImplementationOnce(
      () => ({ screen: 'PageNotFound', params: undefined } as DeeplinkParts)
    )
    const link = 'https://mockValidPrefix2' + '/unknown'
    await openUrl(link)
    expect(openURL).not.toBeCalled()
    expect(navigateFromRef).toBeCalledWith('PageNotFound', undefined)
  })

  it('should log analytics when shouldLogEvent is true', async () => {
    openURLSpy.mockResolvedValueOnce(undefined)
    const link = 'https://www.google.com'

    await openUrl(link)

    await waitForExpect(() => {
      expect(analytics.logOpenExternalUrl).toBeCalledWith(link, {})
    })
  })

  it('should not log analytics event when shouldLogEvent is false', async () => {
    openURLSpy.mockResolvedValueOnce(undefined)
    const link = 'https://www.google.com'

    await openUrl(link, { shouldLogEvent: false })

    await waitForExpect(() => {
      expect(analytics.logOpenExternalUrl).not.toBeCalled()
    })
  })

  it('should display alert when Linking.openURL throws', async () => {
    jest
      .spyOn(Linking, 'openURL')
      .mockImplementationOnce(() => Promise.reject(new Error('Did not open correctly')))
    const alertMock = jest.spyOn(Alert, 'alert')
    const link = 'https://www.google.com'

    await openUrl(link)
    expect(alertMock).toHaveBeenCalled()
  })
  it('should not display alert when Linking.openURL throws but fallbackUrl is valid', async () => {
    // Last in first out, it will fail then succeed.
    jest.spyOn(Linking, 'openURL').mockResolvedValueOnce(undefined)
    jest
      .spyOn(Linking, 'openURL')
      .mockImplementationOnce(() => Promise.reject(new Error('Did not open correctly')))
    const alertMock = jest.spyOn(Alert, 'alert')
    const link = 'https://www.google.com'
    const fallbackLink = 'https://www.googlefallback.com'

    await openUrl(link, { fallbackUrl: fallbackLink })
    expect(alertMock).not.toHaveBeenCalled()
  })

  describe('isAppUrl', () => {
    it('should return false if url does not start with linking prefixes', () => {
      const url = isAppUrl('https://notavalidprefix')
      expect(url).toEqual(false)
    })
    it('should return true if url starts with linking prefixes', () => {
      const url = isAppUrl('https://mockValidPrefix1')
      expect(url).toEqual(true)
    })
  })

  describe('[Method] navigateToBooking', () => {
    it('should navigate to BookingDetails', async () => {
      const bookingId = 37815152
      navigateToBooking(bookingId)
      expect(navigateFromRef).toBeCalledWith('BookingDetails', { id: bookingId })
    })
  })
})
