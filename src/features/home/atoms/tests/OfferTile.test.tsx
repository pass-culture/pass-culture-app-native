import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { dehumanizeId } from 'features/offer/services/dehumanizeId'
import { mockedAlgoliaResponse } from 'libs/algolia/mockedResponses/mockedAlgoliaResponse'
import { analytics } from 'libs/analytics'
import { queryCache, reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'

import { OfferTile } from '../OfferTile'

const offer = mockedAlgoliaResponse.hits[0].offer
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const offerId = dehumanizeId(offer.id)!
const props = {
  category: offer.category || '',
  categoryName: offer.category,
  description: offer.description || '',
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
    const { toJSON } = render(<OfferTile {...props} />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should navigate to the offer when clicking on the image', async () => {
    const { getByTestId } = render(reactQueryProviderHOC(<OfferTile {...props} />))
    fireEvent.press(getByTestId('offerTileImage'))
    expect(navigate).toHaveBeenCalledWith('Offer', { id: offerId })
  })
  it('Analytics - should log ConsultOffer that user opened the offer', async () => {
    const { getByTestId } = render(reactQueryProviderHOC(<OfferTile {...props} />))
    fireEvent.press(getByTestId('offerTileImage'))
    expect(analytics.logConsultOffer).toHaveBeenCalledWith(offerId, 'Module Name')
  })

  it('should prepopulate react-query cache when clicking on offer', async () => {
    const { getByTestId } = render(reactQueryProviderHOC(<OfferTile {...props} />))
    fireEvent.press(getByTestId('offerTileImage'))

    const queryHash = JSON.stringify(['offer', offerId])
    const query = queryCache.get(queryHash)
    expect(query).not.toBeUndefined()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(query!.state.data).toStrictEqual({
      accessibility: {},
      category: { label: 'MUSIQUE', name: 'MUSIQUE' },
      description: offer.description,
      fullAddress: null,
      id: offerId,
      image: { url: props.thumbUrl },
      isDigital: false,
      isDuo: false,
      name: offer.name,
      stocks: [],
      venue: { coordinates: {} },
      isActive: true,
    })
  })
})
