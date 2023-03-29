import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'

import { OfferBody } from 'features/offer/components/OfferBody/OfferBody'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import * as InstalledAppsCheck from 'features/offer/helpers/checkInstalledApps/checkInstalledApps'
import { offerId } from 'features/offer/helpers/renderOfferPageTestUtil'
import { analytics } from 'libs/firebase/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'
import { Network } from 'ui/components/ShareMessagingApp'

const mockCheckInstalledApps = jest.spyOn(InstalledAppsCheck, 'checkInstalledApps') as jest.Mock

jest.mock('features/auth/context/AuthContext')

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
    renderOfferBodyForAnalytics()

    await screen.findByText(offerResponseSnap.name)
    expect(analytics.logOfferSeenDuration).not.toHaveBeenCalled()

    screen.unmount()

    expect(analytics.logOfferSeenDuration).toHaveBeenCalledTimes(1)
  })

  it('should log ConsultAccessibilityModalities once when opening accessibility modalities', async () => {
    renderOfferBodyForAnalytics()

    const accessibilityButton = await screen.findByText('Accessibilité')
    trigger(accessibilityButton)
    expect(analytics.logConsultAccessibility).toHaveBeenNthCalledWith(1, { offerId })

    trigger(accessibilityButton)
    expect(analytics.logConsultAccessibility).toHaveBeenCalledTimes(1)
  })

  it('should log ConsultWithdrawalModalities once when opening withdrawal modalities', async () => {
    renderOfferBodyForAnalytics()

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
    renderOfferBodyForAnalytics()

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
    renderOfferBodyForAnalytics()

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

const onScroll = jest.fn()
const renderOfferBodyForAnalytics = (
  additionalProps: {
    sameCategorySimilarOffers?: SearchHit[]
    otherCategoriesSimilarOffers?: SearchHit[]
  } = {}
) =>
  render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(<OfferBody offerId={offerId} onScroll={onScroll} {...additionalProps} />)
  )
