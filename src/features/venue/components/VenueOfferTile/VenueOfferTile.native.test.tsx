import React from 'react'

import { push } from '__mocks__/@react-navigation/native'
import { CategoryIdEnum, HomepageLabelNameEnumv2 } from 'api/gen'
import { VenueOfferTile } from 'features/venue/components/VenueOfferTile/VenueOfferTile'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { analytics } from 'libs/analytics'
import { queryCache, reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

const OFFER = mockedAlgoliaResponse.hits[0].offer
const OFFER_LOCATION = mockedAlgoliaResponse.hits[0]._geoloc
const OFFER_ID = 116656
const VENUE_ID = 34

const props = {
  categoryLabel: HomepageLabelNameEnumv2.MUSIQUE,
  categoryId: CategoryIdEnum.MUSIQUE_LIVE,
  subcategoryId: OFFER.subcategoryId,
  expenseDomains: [],
  date: 'Dès le 12 mars 2020',
  name: OFFER.name,
  isDuo: OFFER.isDuo,
  offerId: OFFER_ID,
  offerLocation: OFFER_LOCATION,
  price: '28 €',
  thumbUrl: OFFER.thumbUrl,
  venueId: VENUE_ID,
  width: 100,
  height: 100,
}

describe('VenueOfferTile component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should navigate to the offer when clicking on the image', async () => {
    render(reactQueryProviderHOC(<VenueOfferTile {...props} />))

    fireEvent.press(screen.getByTestId('tileImage'))

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('Offer', {
        id: OFFER_ID,
        from: 'venue',
      })
    })
  })

  it('Analytics - should log ConsultOffer that user opened the offer', async () => {
    render(reactQueryProviderHOC(<VenueOfferTile {...props} />))
    fireEvent.press(screen.getByTestId('tileImage'))

    expect(analytics.logConsultOffer).toHaveBeenNthCalledWith(1, {
      offerId: OFFER_ID,
      from: 'venue',
      venueId: VENUE_ID,
    })
  })

  it('should prepopulate react-query cache when clicking on offer', async () => {
    render(reactQueryProviderHOC(<VenueOfferTile {...props} />))
    fireEvent.press(screen.getByTestId('tileImage'))

    const queryHash = JSON.stringify(['offer', OFFER_ID])
    const query = queryCache.get(queryHash)

    expect(query).not.toBeUndefined()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(query!.state.data).toStrictEqual({
      accessibility: {},
      description: '',
      expenseDomains: [],
      id: OFFER_ID,
      images: { recto: { url: props.thumbUrl } },
      isDigital: false,
      isDuo: false,
      isReleased: true,
      isExpired: false,
      isForbiddenToUnderage: false,
      isSoldOut: false,
      name: OFFER.name,
      stocks: [],
      subcategoryId: OFFER.subcategoryId,
      venue: { coordinates: {} },
      isEducational: false,
      metadata: undefined,
      isExternalBookingsDisabled: false,
    })
  })
})
