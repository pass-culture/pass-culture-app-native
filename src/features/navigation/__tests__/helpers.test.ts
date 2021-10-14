import { Linking } from 'react-native'
import waitForExpect from 'wait-for-expect'

import { WEBAPP_NATIVE_REDIRECTION_URL } from 'features/deeplinks'
import { navigationRef } from 'features/navigation/navigationRef'
import { getScreenPath } from 'features/navigation/RootNavigator/linking/getScreenPath'
import { analytics } from 'libs/analytics'

import { openExternalUrl, navigateToBooking } from '../helpers'

jest.mock('features/navigation/navigationRef')

describe('Navigation helpers', () => {
  afterEach(jest.clearAllMocks)

  it('should not capture links that doesnt start with the universal links domain', async () => {
    const openURL = jest.spyOn(Linking, 'openURL').mockResolvedValueOnce(undefined)
    const link = 'https://www.google.com'
    await openExternalUrl(link)
    expect(openURL).toBeCalledWith(link)
  })

  it('should navigate to in-app screen and navigate to it (ex: Offer)', async () => {
    const openURL = jest.spyOn(Linking, 'openURL').mockResolvedValueOnce(undefined)
    const path = getScreenPath('Offer', { id: 1, from: 'offer', moduleName: undefined })
    const link = WEBAPP_NATIVE_REDIRECTION_URL + `/${path}`
    await openExternalUrl(link)
    expect(openURL).not.toBeCalled()
    expect(navigationRef.current?.navigate).toBeCalledWith('Offer', { id: 1, from: 'offer' })
  })

  it('should navigate to PageNotFound when in-app screen cannot be found (ex: Offer)', async () => {
    const openURL = jest.spyOn(Linking, 'openURL').mockResolvedValueOnce(undefined)
    const link = WEBAPP_NATIVE_REDIRECTION_URL + '/unknown'
    await openExternalUrl(link)
    expect(openURL).not.toBeCalled()
    expect(navigationRef.current?.navigate).toBeCalledWith('PageNotFound', undefined)
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
})
