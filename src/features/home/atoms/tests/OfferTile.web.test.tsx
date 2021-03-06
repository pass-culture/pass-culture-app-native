import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { analytics } from 'libs/analytics'
import { mockedAlgoliaResponse } from 'libs/search/fixtures'
import { queryCache, reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render } from 'tests/utils/web'

import { OfferTile } from '../OfferTile'

const offer = mockedAlgoliaResponse.hits[0].offer
const offerId = 116656

const props = {
  category: offer.category || '',
  categoryName: offer.category,
  description: offer.description || '',
  expenseDomains: [],
  distance: '1,2km',
  date: 'Dès le 12 mars 2020',
  name: offer.name,
  isDuo: offer.isDuo,
  offerId,
  price: '28 €',
  thumbUrl: offer.thumbUrl,
  moduleName: 'Module Name',
}

describe('OfferTile component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should render correctly', () => {
    const renderAPI = render(reactQueryProviderHOC(<OfferTile {...props} />))
    expect(renderAPI).toMatchSnapshot()
  })

  // FIXME: Web integration
  it.skip('should navigate to the offer when clicking on the image [WEB INTEGRATION REQUIRED]', async () => {
    const { getByTestId } = render(reactQueryProviderHOC(<OfferTile {...props} />))
    fireEvent.click(getByTestId('offerTileImage'))
    expect(navigate).toHaveBeenCalledWith('Offer', {
      id: offerId,
      from: 'home',
      moduleName: 'Module Name',
    })
  })

  // FIXME: Web integration
  it.skip('Analytics - should log ConsultOffer that user opened the offer [WEB INTEGRATION REQUIRED]', async () => {
    const { getByTestId } = render(reactQueryProviderHOC(<OfferTile {...props} />))
    fireEvent.click(getByTestId('offerTileImage'))
    expect(analytics.logConsultOffer).toHaveBeenCalledWith({
      offerId,
      from: 'home',
      moduleName: props.moduleName,
    })
  })

  // FIXME: Web integration
  it.skip('should prepopulate react-query cache when clicking on offer [WEB INTEGRATION REQUIRED]', async () => {
    const { getByTestId } = render(reactQueryProviderHOC(<OfferTile {...props} />))
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
