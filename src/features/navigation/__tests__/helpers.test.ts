import { Linking, Platform } from 'react-native'
import waitForExpect from 'wait-for-expect'

import { WEBAPP_NATIVE_REDIRECTION_URL } from 'features/deeplinks'
import { DeeplinkPath, DeeplinkPathWithPathParams } from 'features/deeplinks/enums'
import { navigationRef } from 'features/navigation/navigationRef'
import { analytics } from 'libs/analytics'

import {
  openExternalUrl,
  navigateToBooking,
  homeNavigateConfig,
  openExternalPhoneNumber,
} from '../helpers'

jest.mock('features/navigation/navigationRef')

describe('Navigation helpers', () => {
  afterEach(jest.clearAllMocks)

  it('should not capture links that doesnt start with the universal links domain', async () => {
    const openUrl = jest.spyOn(Linking, 'openURL').mockResolvedValueOnce(undefined)
    const link = 'https://www.google.com'
    await openExternalUrl(link)
    expect(openUrl).toBeCalledWith(link)
  })

  it('should navigate to in-app screen and navigate to it (ex: Offer)', async () => {
    const openUrl = jest.spyOn(Linking, 'openURL').mockResolvedValueOnce(undefined)
    const path = new DeeplinkPathWithPathParams(DeeplinkPath.OFFER, { id: '1' }).getFullPath()
    const link = WEBAPP_NATIVE_REDIRECTION_URL + `/${path}`
    await openExternalUrl(link)
    expect(openUrl).not.toBeCalled()
    expect(navigationRef.current?.navigate).toBeCalledWith('Offer', { id: 1 })
  })

  it('should navigate to home when in-app screen cannot be found (ex: Offer)', async () => {
    const openUrl = jest.spyOn(Linking, 'openURL').mockResolvedValueOnce(undefined)
    const link = WEBAPP_NATIVE_REDIRECTION_URL + '/unknown'
    await openExternalUrl(link)
    expect(openUrl).not.toBeCalled()
    expect(navigationRef.current?.navigate).toBeCalledWith(
      homeNavigateConfig.screen,
      homeNavigateConfig.params
    )
  })

  it('should log analytics when logEvent is true', async () => {
    jest.spyOn(Linking, 'openURL').mockResolvedValueOnce(undefined)
    const link = 'https://www.google.com'

    await openExternalUrl(link)

    await waitForExpect(() => {
      expect(analytics.logOpenExternalUrl).toBeCalledWith(link)
    })
  })

  it('should not log analytics event when logEvent is false', async () => {
    jest.spyOn(Linking, 'openURL').mockResolvedValueOnce(undefined)
    const link = 'https://www.google.com'

    await openExternalUrl(link, false)

    await waitForExpect(() => {
      expect(analytics.logOpenExternalUrl).not.toBeCalled()
    })
  })

  describe('[Method] navigateToBooking', () => {
    it('should navigate to BookingDetails', async () => {
      const bookingId = 37815152
      navigateToBooking(bookingId)
      expect(navigationRef.current?.navigate).toBeCalledWith('BookingDetails', { id: bookingId })
    })
  })

  describe('openExternalPhoneNumber', () => {
    const openUrl = jest.spyOn(Linking, 'openURL').mockResolvedValueOnce(undefined)
    const phoneNumber = '0610203040'

    it('should navigate phone keyboard with "telprompt:" if is iOS device', async () => {
      Platform.OS = 'ios'
      openExternalPhoneNumber(phoneNumber)
      await waitForExpect(() => {
        expect(openUrl).toBeCalledWith(`telprompt:${phoneNumber}`)
      })
    })

    it('should navigate phone keyboard with "tel:" if is Androïd device', async () => {
      Platform.OS = 'android'
      openExternalPhoneNumber(phoneNumber)
      await waitForExpect(() => {
        expect(openUrl).toBeCalledWith(`tel:${phoneNumber}`)
      })
    })
  })
})
