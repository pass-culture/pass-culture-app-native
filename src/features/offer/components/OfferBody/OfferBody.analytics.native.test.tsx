import { rest } from 'msw'
import { ReactTestInstance } from 'react-test-renderer'

import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import * as InstalledAppsCheck from 'features/offer/helpers/checkInstalledApps/checkInstalledApps'
import { offerId, renderOfferBodyPage } from 'features/offer/helpers/renderOfferPageTestUtil'
import { analytics } from 'libs/firebase/analytics'
import { server } from 'tests/server'
import { act, fireEvent, screen } from 'tests/utils'
import { Network } from 'ui/components/ShareMessagingApp'

const mockCheckInstalledApps = jest.spyOn(InstalledAppsCheck, 'checkInstalledApps') as jest.Mock

server.use(
  rest.get(
    `https://recommmendation-endpoint/similar_offers/${offerResponseSnap.id}`,
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          hits: [],
        })
      )
    }
  )
)

describe('<OfferBody /> - Analytics', () => {
  beforeAll(() => {
    jest.useFakeTimers('legacy')
  })

  const trigger = (component: ReactTestInstance) => {
    fireEvent.press(component)
    //The Accessibility accordion is animated so we wait until its fully open before testing the analytics
    act(() => {
      jest.runAllTimers()
    })
  }

  it('should trigger logOfferSeenDuration after unmount', async () => {
    renderOfferBodyPage()

    await screen.findByText(offerResponseSnap.name)
    expect(analytics.logOfferSeenDuration).not.toHaveBeenCalled()

    screen.unmount()

    expect(analytics.logOfferSeenDuration).toHaveBeenCalledTimes(1)
  })

  it('should log ConsultAccessibilityModalities once when opening accessibility modalities', async () => {
    renderOfferBodyPage()

    const accessibilityButton = await screen.findByText('Accessibilité')
    trigger(accessibilityButton)
    expect(analytics.logConsultAccessibility).toHaveBeenNthCalledWith(1, { offerId })

    trigger(accessibilityButton)
    expect(analytics.logConsultAccessibility).toHaveBeenCalledTimes(1)
  })

  it('should log ConsultWithdrawalModalities once when opening withdrawal modalities', async () => {
    renderOfferBodyPage()

    const withdrawalButton = await screen.findByText('Modalités de retrait')
    trigger(withdrawalButton)
    expect(analytics.logConsultWithdrawal).toHaveBeenNthCalledWith(1, { offerId })

    trigger(withdrawalButton)
    expect(analytics.logConsultWithdrawal).toHaveBeenCalledTimes(1)
  })

  it('should log Share with chosen social medium on social medium button press', async () => {
    mockCheckInstalledApps.mockResolvedValueOnce({
      [Network.snapchat]: true,
    })
    renderOfferBodyPage()

    const socialMediumButton = await screen.findByText(`Envoyer sur ${[Network.snapchat]}`)
    fireEvent.press(socialMediumButton)

    expect(analytics.logShare).toHaveBeenNthCalledWith(1, {
      type: 'Offer',
      from: 'offer',
      id: offerId,
      social: Network.snapchat,
    })
  })

  it('should open native share modal on "Plus d’options" press', async () => {
    renderOfferBodyPage()

    const otherButton = await screen.findByText('Plus d’options')
    fireEvent.press(otherButton)

    expect(analytics.logShare).toHaveBeenNthCalledWith(1, {
      type: 'Offer',
      from: 'offer',
      id: offerId,
      social: 'Other',
    })
  })
})
