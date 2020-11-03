import { render, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { algoliaHits } from 'libs/algolia/algoliaHits'

import { OfferTile } from './OfferTile'

describe('OfferTile component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should render correctly', () => {
    const { toJSON } = render(<OfferTile tile={algoliaHits[0]} />)
    expect(toJSON()).toMatchSnapshot()
  })

  // Temporary test. We have to adapt it with navigation once implemented
  it('should navigate to the offer when clicking on the image', async () => {
    global.console = { ...global.console, log: jest.fn() }
    const { getByTestId } = render(<OfferTile tile={algoliaHits[0]} />)
    fireEvent.press(getByTestId('offerTileImage'))
    expect(console.log).toHaveBeenCalledWith('Opening offer XU8A...') // eslint-disable-line no-console
  })
})
