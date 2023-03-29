import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'

import { OfferBody } from 'features/offer/components/OfferBody/OfferBody'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import * as InstalledAppsCheck from 'features/offer/helpers/checkInstalledApps/checkInstalledApps'
import { offerId } from 'features/offer/helpers/renderOfferPageTestUtil'
import { SearchHit } from 'libs/algolia'
import {
  mockedAlgoliaResponse,
  moreHitsForSimilarOffersPlaylist,
} from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { analytics } from 'libs/firebase/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'
import { Network } from 'ui/components/ShareMessagingApp'

const mockCheckInstalledApps = jest.spyOn(InstalledAppsCheck, 'checkInstalledApps') as jest.Mock

jest.mock('features/auth/context/AuthContext')

const mockSearchHits: SearchHit[] = [
  ...mockedAlgoliaResponse.hits,
  ...moreHitsForSimilarOffersPlaylist,
]

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

  it('should log when the user has seen the offer after unmount', async () => {
    renderOfferBodyForAnalytics()

    await screen.findByText(offerResponseSnap.name)
    expect(analytics.logOfferSeenDuration).not.toHaveBeenCalled()

    screen.unmount()

    expect(analytics.logOfferSeenDuration).toHaveBeenCalledTimes(1)
  })

  it('should log that the user has open accessibility modalities only once', async () => {
    renderOfferBodyForAnalytics()

    const accessibilityButton = await screen.findByText('Accessibilité')
    trigger(accessibilityButton)
    expect(analytics.logConsultAccessibility).toHaveBeenNthCalledWith(1, { offerId })

    trigger(accessibilityButton)
    expect(analytics.logConsultAccessibility).toHaveBeenCalledTimes(1)
  })

  it('should log that the user has open withdrawal modalities only once', async () => {
    renderOfferBodyForAnalytics()

    const withdrawalButton = await screen.findByText('Modalités de retrait')

    trigger(withdrawalButton)
    expect(analytics.logConsultWithdrawal).toHaveBeenNthCalledWith(1, { offerId })

    trigger(withdrawalButton)
    expect(analytics.logConsultWithdrawal).toHaveBeenCalledTimes(1)
  })

  it('should log when the user share the offer on a certain medium', async () => {
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

  it('should log when the user press "Plus d’options" share button', async () => {
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

  it('should log when the user press the venue banner', async () => {
    renderOfferBodyForAnalytics()

    const venueBannerComponent = await screen.findByTestId(`Lieu ${offerResponseSnap.venue.name}`)

    fireEvent.press(venueBannerComponent)
    expect(analytics.logConsultVenue).toHaveBeenNthCalledWith(1, {
      venueId: offerResponseSnap.venue.id,
      from: 'offer',
    })
  })

  it('should log when the user scrolls same categories playlist', async () => {
    const nativeEventMiddle = {
      layoutMeasurement: { height: 296 },
      contentOffset: { x: 200 }, // how far did we scroll
      contentSize: { height: 296 },
    }
    renderOfferBodyForAnalytics({
      sameCategorySimilarOffers: mockSearchHits,
    })

    const scrollView = (await screen.findAllByTestId('offersModuleList'))[0]

    scrollView.props.onScroll({ nativeEvent: nativeEventMiddle })

    expect(analytics.logPlaylistHorizontalScroll).toHaveBeenCalledTimes(1)
  })

  it('should log when the user scrolls other categories playlist', async () => {
    const nativeEventMiddle = {
      layoutMeasurement: { height: 296, width: 296 },
      contentOffset: { x: 200 }, // how far did we scroll
      contentSize: { height: 296, width: 296 },
    }
    renderOfferBodyForAnalytics({
      otherCategoriesSimilarOffers: mockSearchHits,
    })
    const scrollView = (await screen.findAllByTestId('offersModuleList'))[0]

    scrollView.props.onScroll({ nativeEvent: nativeEventMiddle })

    expect(analytics.logPlaylistHorizontalScroll).toHaveBeenCalledTimes(1)
  })

  it('should log when the users consult the itinerary', async () => {
    renderOfferBodyForAnalytics()
    await screen.findByTestId('offer-container')

    fireEvent.press(screen.getByText('Voir l’itinéraire'))

    expect(analytics.logConsultItinerary).toBeCalledWith({
      offerId: offerResponseSnap.id,
      from: 'offer',
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
