import { render } from '@testing-library/react-native'
import React from 'react'

import { initialSearchState } from 'features/search/pages/reducer'
import { analytics } from 'libs/analytics'

import { SearchResultsComponent } from '../SearchResults'

const mockSearchState = initialSearchState

jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
}))

const props = {
  hits: [],
  hasMore: true,
  refineNext: jest.fn(),
  handleIsScrolling: jest.fn(),
  isScrolling: false,
}
describe('SearchResults component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should log SearchScrollToPage when hitting the bottom of the page', () => {
    const { getByTestId } = render(<SearchResultsComponent {...props} />)
    const flatlist = getByTestId('searchResultsFlatlist')
    flatlist.props.onEndReached()
    expect(analytics.logSearchScrollToPage).toHaveBeenCalledWith(1)
    flatlist.props.onEndReached()
    expect(analytics.logSearchScrollToPage).toHaveBeenCalledWith(2)
  })

  it('should not log SearchScrollToPage when hitting the bottom of the page if no more results', () => {
    const { getByTestId } = render(<SearchResultsComponent {...props} hasMore={false} />)
    const flatlist = getByTestId('searchResultsFlatlist')
    flatlist.props.onEndReached()
    expect(analytics.logSearchScrollToPage).not.toHaveBeenCalled()
  })
})
