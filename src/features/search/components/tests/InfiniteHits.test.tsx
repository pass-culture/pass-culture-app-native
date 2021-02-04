import { render } from '@testing-library/react-native'
import React from 'react'

import { initialSearchState } from 'features/search/pages/reducer'
import { analytics } from 'libs/analytics'

import { InfiniteHitsComponent } from '../InfiniteHits'

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
describe('InfiniteHits component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should log SearchScrollToPage when hitting the bottom of the page', () => {
    const { getByTestId } = render(<InfiniteHitsComponent {...props} />)
    const flatlist = getByTestId('infiniteHitsFlatlist')
    flatlist.props.onEndReached()
    expect(analytics.logSearchScrollToPage).toHaveBeenCalledWith(1)
    flatlist.props.onEndReached()
    expect(analytics.logSearchScrollToPage).toHaveBeenCalledWith(2)
  })

  it('should not log SearchScrollToPage when hitting the bottom of the page if no more results', () => {
    const { getByTestId } = render(<InfiniteHitsComponent {...props} hasMore={false} />)
    const flatlist = getByTestId('infiniteHitsFlatlist')
    flatlist.props.onEndReached()
    expect(analytics.logSearchScrollToPage).not.toHaveBeenCalled()
  })
})
