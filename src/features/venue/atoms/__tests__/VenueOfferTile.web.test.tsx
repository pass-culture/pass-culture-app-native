import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { analytics } from 'libs/analytics'
import { mockedAlgoliaResponse } from 'libs/search/fixtures'
import { queryCache, reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render } from 'tests/utils/web'

import { VenueOfferTile } from '../VenueOfferTile'

const offer = mockedAlgoliaResponse.hits[0].offer
const offerId = 116656
const venueId = 34

const props = {
  category: offer.category || '',
  categoryName: offer.category,
  expenseDomains: [],
  date: 'Dès le 12 mars 2020',
  name: offer.name,
  isDuo: offer.isDuo,
  offerId,
  price: '28 €',
  thumbUrl: offer.thumbUrl,
  venueId,
}

describe('VenueOfferTile component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should render correctly', () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const renderAPI = render(reactQueryProviderHOC(<VenueOfferTile {...props} />))
    expect(renderAPI).toMatchSnapshot()
  })

  it('should navigate to the offer when clicking on the image', async () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const { getByTestId } = render(reactQueryProviderHOC(<VenueOfferTile {...props} />))
    fireEvent.click(getByTestId('categoryImageCaption'))
    expect(navigate).toHaveBeenCalledWith('Offer', {
      id: offerId,
      from: 'venue',
    })
  })

  it('Analytics - should log ConsultOffer that user opened the offer', async () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const { getByTestId } = render(reactQueryProviderHOC(<VenueOfferTile {...props} />))
    fireEvent.click(getByTestId('categoryImageCaption'))
    expect(analytics.logConsultOffer).toHaveBeenNthCalledWith(1, {
      offerId,
      from: 'venue',
      venueId,
    })
  })

  it('should prepopulate react-query cache when clicking on offer', async () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const { getByTestId } = render(reactQueryProviderHOC(<VenueOfferTile {...props} />))
    fireEvent.click(getByTestId('categoryImageCaption'))

    const queryHash = JSON.stringify(['offer', offerId])
    const query = queryCache.get(queryHash)
    expect(query).not.toBeUndefined()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(query!.state.data).toStrictEqual({
      accessibility: {},
      category: { label: 'MUSIQUE', name: 'MUSIQUE' },
      description: '',
      expenseDomains: [],
      fullAddress: null,
      id: offerId,
      image: { url: props.thumbUrl },
      isDigital: false,
      isDuo: false,
      isReleased: false,
      isEducational: false,
      isExpired: false,
      isSoldOut: false,
      name: offer.name,
      stocks: [],
      venue: { coordinates: {} },
    })
  })
})
