import { render, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { mockedAlgoliaResponse } from '../../../libs/algolia/mockedResponses/mockedAlgoliaResponse'

import { OfferTile } from './OfferTile'

describe('OfferTile component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should render correctly', () => {
    const { toJSON } = render(<OfferTile tile={mockedAlgoliaResponse.hits[0]} />)
    expect(toJSON()).toMatchSnapshot()
  })

  // Temporary test. We have to adapt it with navigation once implemented
  it('should navigate to the offer when clicking on the image', async () => {
    global.console = { ...global.console, log: jest.fn() }
    const { getByTestId } = render(<OfferTile tile={mockedAlgoliaResponse.hits[0]} />)
    fireEvent.press(getByTestId('offerTileImage'))
    expect(console.log).toHaveBeenCalledWith('Opening offer AGHYQ...') // eslint-disable-line no-console
  })
})
