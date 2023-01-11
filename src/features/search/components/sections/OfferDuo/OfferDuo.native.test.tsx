import React from 'react'

import { initialSearchState } from 'features/search/context/reducer'
import { render } from 'tests/utils'

import { OfferDuo } from './OfferDuo'

const mockSearchState = jest.fn().mockReturnValue({
  searchState: initialSearchState,
  dispatch: jest.fn(),
})

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => mockSearchState(),
}))

describe('OfferDuo component', () => {
  it('should render OfferDuo with Activé description', () => {
    mockSearchState.mockReturnValueOnce({
      searchState: {
        offerIsDuo: true,
      },
    })
    const { queryByText } = renderOfferDuo()
    expect(queryByText(`Activé`)).toBeTruthy()
  })

  it('should not render OfferDuo with Activé description', () => {
    mockSearchState.mockReturnValueOnce({
      searchState: {
        offerIsDuo: false,
      },
    })
    const { queryByText } = renderOfferDuo()
    expect(queryByText(`Activé`)).toBeFalsy()
  })
})

function renderOfferDuo() {
  return render(<OfferDuo />)
}
