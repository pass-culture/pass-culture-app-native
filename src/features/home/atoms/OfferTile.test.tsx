import { render, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { mockedAlgoliaResponse } from '../../../libs/algolia/mockedResponses/mockedAlgoliaResponse'

import { OfferTile } from './OfferTile'

const offer = mockedAlgoliaResponse.hits[0].offer
const props = {
  category: offer.category,
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

  /**
   * Temporary test. We have to adapt it with navigation once implemented
   * TODO: change the way this test is made using navigation mock when possible
   */

  it('should navigate to the offer when clicking on the image', async () => {
    global.console = { ...global.console, log: jest.fn() }
    const { getByTestId } = render(<OfferTile {...props} />)
    fireEvent.press(getByTestId('offerTileImage'))
    expect(console.log).toHaveBeenCalledWith('Opening offer AGHYQ...') // eslint-disable-line no-console
  })
})
