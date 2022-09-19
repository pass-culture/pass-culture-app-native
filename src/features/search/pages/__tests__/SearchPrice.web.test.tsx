import React from 'react'

import { initialSearchState } from 'features/search/pages/reducer'
import { SearchPrice } from 'features/search/pages/SearchPrice'
import { render } from 'tests/utils/web'

const mockSearchState = initialSearchState

jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
}))

jest.mock('react-query')

describe('SearchPrice component', () => {
  it('should display mobile header modal if mobile viewport', () => {
    const { getByTestId } = render(
      <SearchPrice
        title="Prix"
        accessibilityLabel="Ne pas filtrer sur les prix et retourner aux résultats"
        isVisible={true}
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
