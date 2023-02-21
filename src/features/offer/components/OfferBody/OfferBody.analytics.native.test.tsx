import { ReactTestInstance } from 'react-test-renderer'
import waitForExpect from 'wait-for-expect'

import * as InstalledAppsCheck from 'features/offer/helpers/checkInstalledApps/checkInstalledApps'
import { offerId, renderOfferBodyPage } from 'features/offer/helpers/renderOfferPageTestUtil'
import { analytics } from 'libs/firebase/analytics'
import { act, fireEvent, screen } from 'tests/utils'
import { Network } from 'ui/components/ShareMessagingApp'

const mockCheckInstalledApps = jest.spyOn(InstalledAppsCheck, 'checkInstalledApps') as jest.Mock

describe('<OfferBody /> - Analytics', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  const trigger = (component: ReactTestInstance) => {
    act(() => {
      fireEvent.press(component)
      jest.advanceTimersByTime(300)
    })
  }

  it('should trigger logOfferSeenDuration after unmount', async () => {
    const offerPage = await renderOfferBodyPage()
    await waitForExpect(async () => {
      expect(analytics.logOfferSeenDuration).not.toHaveBeenCalled()
    })

    await act(async () => {
      await offerPage.unmount()
    })
    await waitForExpect(() => {
      expect(analytics.logOfferSeenDuration).toHaveBeenCalledTimes(1)
    })
  })

  it('should log ConsultAccessibilityModalities once when opening accessibility modalities', async () => {
    const { getByText } = await renderOfferBodyPage()

    trigger(getByText('Accessibilité'))
    expect(analytics.logConsultAccessibility).toHaveBeenCalledTimes(1)
    expect(analytics.logConsultAccessibility).toHaveBeenCalledWith({ offerId })

    trigger(getByText('Accessibilité'))
    trigger(getByText('Accessibilité'))
    expect(analytics.logConsultAccessibility).toHaveBeenCalledTimes(1)
  })

  it('should log ConsultWithdrawalModalities once when opening withdrawal modalities', async () => {
    const { getByText } = await renderOfferBodyPage()

    trigger(getByText('Modalités de retrait'))
    expect(analytics.logConsultWithdrawal).toHaveBeenCalledTimes(1)
    expect(analytics.logConsultWithdrawal).toHaveBeenCalledWith({ offerId })

    trigger(getByText('Modalités de retrait'))
    trigger(getByText('Modalités de retrait'))
    expect(analytics.logConsultWithdrawal).toHaveBeenCalledTimes(1)
  })

  it('should log Share with chosen social medium on social medium button press', async () => {
    mockCheckInstalledApps.mockResolvedValueOnce({
      [Network.snapchat]: true,
    })
    await renderOfferBodyPage()

    const socialMediumButton = screen.getByText(`Envoyer sur ${[Network.snapchat]}`)
    fireEvent.press(socialMediumButton)

    expect(analytics.logShare).toHaveBeenNthCalledWith(1, {
      type: 'Offer',
      from: 'offer',
      id: offerId,
      social: Network.snapchat,
    })
  })

  it('should open native share modal on "Plus d’options" press', async () => {
    await renderOfferBodyPage()

    const otherButton = screen.getByText('Plus d’options')
    fireEvent.press(otherButton)

    expect(analytics.logShare).toHaveBeenNthCalledWith(1, {
      type: 'Offer',
      from: 'offer',
      id: offerId,
      social: 'Other',
    })
  })
})
