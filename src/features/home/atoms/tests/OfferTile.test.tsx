import { render, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { mockedAlgoliaResponse } from 'libs/algolia/mockedResponses/mockedAlgoliaResponse'
import { logConsultOffer } from 'libs/analytics'

import { OfferTile } from '../OfferTile'

const offer = mockedAlgoliaResponse.hits[0].offer
const props = {
  category: offer.category || '',
  distance: '1,2km',
  date: 'Dès le 12 mars 2020',
  name: offer.name,
  isDuo: offer.isDuo,
  offerId: offer.id,
  price: '28 €',
  thumbUrl: offer.thumbUrl,
}

describe('OfferTile component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should render correctly', () => {
    const { toJSON } = render(<OfferTile {...props} />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should navigate to the offer when clicking on the image', async () => {
    const { getByTestId } = render(<OfferTile {...props} />)
    fireEvent.press(getByTestId('offerTileImage'))
    expect(navigate).toHaveBeenCalledWith('Offer', { offerId: 'AGHYQ' })
  })
  it('Analytics - should log ConsultOffer that user opened the offer', async () => {
    const { getByTestId } = render(<OfferTile {...props} />)
    fireEvent.press(getByTestId('offerTileImage'))
    expect(logConsultOffer).toHaveBeenCalledWith('AGHYQ')
  })
})
