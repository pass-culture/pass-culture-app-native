import React from 'react'

import { push } from '__mocks__/@react-navigation/native'
import { CategoryIdEnum, HomepageLabelNameEnumv2 } from 'api/gen'
import { VenueOfferTile } from 'features/venue/components/VenueOfferTile/VenueOfferTile'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { analytics } from 'libs/analytics'
import { queryCache, reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

// @ts-expect-error: because of noUncheckedIndexedAccess
const offer = mockedAlgoliaResponse.hits[0].offer
const offerId = 116656
const venueId = 34

const props = {
  categoryLabel: HomepageLabelNameEnumv2.MUSIQUE,
  categoryId: CategoryIdEnum.MUSIQUE_LIVE,
  subcategoryId: offer.subcategoryId,
  expenseDomains: [],
  date: 'Dès le 12 mars 2020',
  name: offer.name,
  isDuo: offer.isDuo,
  offerId,
  price: '28 €',
  thumbUrl: offer.thumbUrl,
  venueId,
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
        id: offerId,
        from: 'venue',
      })
    })
  })

  it('Analytics - should log ConsultOffer that user opened the offer', async () => {
    render(reactQueryProviderHOC(<VenueOfferTile {...props} />))
    fireEvent.press(screen.getByTestId('tileImage'))

    expect(analytics.logConsultOffer).toHaveBeenNthCalledWith(1, {
      offerId,
      from: 'venue',
      venueId,
    })
  })

  it('should prepopulate react-query cache when clicking on offer', async () => {
    render(reactQueryProviderHOC(<VenueOfferTile {...props} />))
    fireEvent.press(screen.getByTestId('tileImage'))

    const queryHash = JSON.stringify(['offer', offerId])
    const query = queryCache.get(queryHash)

    expect(query).not.toBeUndefined()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(query!.state.data).toStrictEqual({
      accessibility: {},
      description: '',
      expenseDomains: [],
      id: offerId,
      image: { url: props.thumbUrl },
      isDigital: false,
      isDuo: false,
      isReleased: true,
      isExpired: false,
      isForbiddenToUnderage: false,
      isSoldOut: false,
      name: offer.name,
      stocks: [],
      subcategoryId: offer.subcategoryId,
      venue: { coordinates: {} },
      isEducational: false,
      metadata: undefined,
    })
  })
})
