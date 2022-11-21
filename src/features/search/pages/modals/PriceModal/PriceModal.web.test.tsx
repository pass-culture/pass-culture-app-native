import React from 'react'

import { initialSearchState } from 'features/search/context/reducer'
import { render } from 'tests/utils/web'

import { PriceModal } from './PriceModal'

const mockSearchState = initialSearchState

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
}))

jest.mock('react-query')

describe('PriceModal component', () => {
  it('should display mobile header modal if mobile viewport', () => {
    const { getByTestId } = render(
      <PriceModal
        title="Prix"
        accessibilityLabel="Ne pas filtrer sur les prix et retourner aux résultats"
        isVisible
        hideModal={jest.fn()}
      />,
      {
        theme: { isDesktopViewport: false, isMobileViewport: true },
      }
    )

    const pageHeader = getByTestId('pageHeader')

    expect(pageHeader).toBeTruthy()
  })
})
