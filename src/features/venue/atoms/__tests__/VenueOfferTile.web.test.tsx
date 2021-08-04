import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { mockedAlgoliaResponse } from 'libs/search/fixtures'
import { queryCache, reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render } from 'tests/utils/web'

import { VenueOfferTile } from '../VenueOfferTile'

const offer = mockedAlgoliaResponse.hits[0].offer
const offerId = 116656

const props = {
  category: offer.category || '',
  categoryName: offer.category,
  description: offer.description || '',
  expenseDomains: [],
  date: 'Dès le 12 mars 2020',
  name: offer.name,
  isDuo: offer.isDuo,
  offerId,
  price: '28 €',
  thumbUrl: offer.thumbUrl,
}

describe('VenueOfferTile component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should render correctly', () => {
    const renderAPI = render(reactQueryProviderHOC(<VenueOfferTile {...props} />))
    expect(renderAPI).toMatchSnapshot()
  })

  // FIXME: Web integration. Unable to find ID "offerTileImage". Investigate react-native-fast-image
  it.skip('should navigate to the offer when clicking on the image [WEB INTEGRATION REQUIRED]', async () => {
    const { getByTestId } = render(reactQueryProviderHOC(<VenueOfferTile {...props} />))
    fireEvent.click(getByTestId('offerTileImage'))
    expect(navigate).toHaveBeenCalledWith('Offer', {
      id: offerId,
      from: 'venue',
    })
  })

  // FIXME: Web integration. Unable to find ID "offerTileImage". Investigate react-native-fast-image
  it.skip('should prepopulate react-query cache when clicking on offer [WEB INTEGRATION REQUIRED]', async () => {
    const { getByTestId } = render(reactQueryProviderHOC(<VenueOfferTile {...props} />))
    fireEvent.click(getByTestId('offerTileImage'))

    const queryHash = JSON.stringify(['offer', offerId])
    const query = queryCache.get(queryHash)
    expect(query).not.toBeUndefined()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(query!.state.data).toStrictEqual({
      accessibility: {},
      category: { label: 'MUSIQUE', name: 'MUSIQUE' },
      description: offer.description,
      expenseDomains: [],
      fullAddress: null,
      id: offerId,
      image: { url: props.thumbUrl },
      isDigital: false,
      isDuo: false,
      isReleased: false,
      isExpired: false,
      isSoldOut: false,
      name: offer.name,
      stocks: [],
      venue: { coordinates: {} },
    })
  })
})
