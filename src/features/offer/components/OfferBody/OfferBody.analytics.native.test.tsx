import React from 'react'
import { Linking } from 'react-native'
import { ReactTestInstance } from 'react-test-renderer'

import { SubcategoryIdEnum } from 'api/gen'
import { OfferBody } from 'features/offer/components/OfferBody/OfferBody'
import { VenueListItem } from 'features/offer/components/VenueSelectionList/VenueSelectionList'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { offerId } from 'features/offer/helpers/renderOfferPageTestUtil'
import {
  mockedAlgoliaResponse,
  moreHitsForSimilarOffersPlaylist,
} from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { analytics } from 'libs/analytics'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { Offer } from 'shared/offer/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'
import { Network } from 'ui/components/ShareMessagingApp'

const canOpenURLSpy = jest.spyOn(Linking, 'canOpenURL')

jest.mock('features/auth/context/AuthContext')

const mockUseOffer = jest.fn().mockImplementation(() => ({
  data: offerResponseSnap,
}))

jest.mock('features/offer/api/useOffer', () => ({
  useOffer: () => mockUseOffer(),
}))

const useFeatureFlagSpy = jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)

const mockSearchHits: Offer[] = [...mockedAlgoliaResponse.hits, ...moreHitsForSimilarOffersPlaylist]
const offerVenues = [
  {
    title: 'Envie de lire',
    address: '94200 Ivry-sur-Seine, 16 rue Gabriel Peri',
    distance: '500 m',
    offerId: 1,
    price: 1000,
  },
  {
    title: 'Le Livre Éclaire',
    address: '75013 Paris, 56 rue de Tolbiac',
    distance: '1,5 km',
    offerId: 2,
    price: 1000,
  },
  {
    title: 'Hachette Livre',
    address: '94200 Ivry-sur-Seine, Rue Charles du Colomb',
    distance: '2,4 km',
    offerId: 3,
    price: 1000,
  },
]
const mockHasNextPage = true
const mockFetchNextPage = jest.fn()
const mockData = {
  pages: [
    {
      nbHits: 0,
      hits: [],
      page: 0,
    },
  ],
}
let mockVenueList: VenueListItem[] = []
let mockNbVenueItems = 0
jest.mock('api/useSearchVenuesOffer/useSearchVenueOffers', () => ({
  useSearchVenueOffers: () => ({
    hasNextPage: mockHasNextPage,
    fetchNextPage: mockFetchNextPage,
    data: mockData,
    venueList: mockVenueList,
    nbVenueItems: mockNbVenueItems,
    isFetching: false,
  }),
}))

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

  it('should log when the user shares the offer on a certain medium', async () => {
    canOpenURLSpy.mockResolvedValueOnce(true)
    renderOfferBodyForAnalytics()

    const socialMediumButton = await screen.findByText(`Envoyer sur ${[Network.instagram]}`)
    fireEvent.press(socialMediumButton)

    expect(analytics.logShare).toHaveBeenNthCalledWith(1, {
      type: 'Offer',
      from: 'offer',
      id: offerId,
      social: Network.instagram,
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

  describe('When wipEnableMultivenueOffer feature flag activated', () => {
    beforeEach(() => {
      mockUseOffer.mockImplementation(() => ({
        data: {
          ...offerResponseSnap,
          subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
          extraData: {
            ean: '2765410054',
          },
        },
      }))
      useFeatureFlagSpy.mockImplementation(() => true)
    })
    it('should log when the users press the change venue modal', async () => {
      mockNbVenueItems = 2
      mockVenueList = offerVenues

      renderOfferBodyForAnalytics()
      await screen.findByTestId('offer-container')

      fireEvent.press(screen.getByText('Voir d’autres lieux disponibles'))

      expect(analytics.logMultivenueOptionDisplayed).toBeCalledWith(offerResponseSnap.id)
    })
  })
})

const onScroll = jest.fn()
const renderOfferBodyForAnalytics = (
  additionalProps: {
    sameCategorySimilarOffers?: Offer[]
    otherCategoriesSimilarOffers?: Offer[]
  } = {}
) =>
  render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(<OfferBody offerId={offerId} onScroll={onScroll} {...additionalProps} />)
  )
