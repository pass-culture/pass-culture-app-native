import React from 'react'

import { initialSearchState } from 'features/search/context/reducer'
import { render, screen } from 'tests/utils'

import { OfferDuo } from './OfferDuo'

const mockSearchState = jest.fn().mockReturnValue({
  searchState: initialSearchState,
  dispatch: jest.fn(),
})

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => mockSearchState(),
}))

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('OfferDuo component', () => {
  it('should render OfferDuo with Activé description', () => {
    mockSearchState.mockReturnValueOnce({
      searchState: {
        offerIsDuo: true,
      },
    })
    renderOfferDuo()

    expect(screen.getByText(`Activé`)).toBeOnTheScreen()
  })

  it('should not render OfferDuo with Activé description', () => {
    mockSearchState.mockReturnValueOnce({
      searchState: {
        offerIsDuo: false,
      },
    })
    renderOfferDuo()

    expect(screen.queryByText(`Activé`)).not.toBeOnTheScreen()
  })
})

function renderOfferDuo() {
  return render(<OfferDuo />)
}
