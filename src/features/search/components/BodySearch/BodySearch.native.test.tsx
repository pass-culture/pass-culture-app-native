import React from 'react'

import { mockSuggestionHits } from 'features/search/fixtures/algolia'
import { SearchView } from 'features/search/types'
import { placeholderData as mockData } from 'libs/subcategories/placeholderData'
import { act, render, screen } from 'tests/utils'

import { BodySearch } from './BodySearch'

jest.mock('react-query')

jest.mock('react-instantsearch-hooks', () => ({
  useInfiniteHits: () => ({
    hits: mockSuggestionHits,
  }),
}))

jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

jest.mock('features/search/api/useSearchResults/useSearchResults', () => ({
  useSearchResults: () => ({
    data: mockData,
    hits: [],
    nbHits: 0,
    isFetching: false,
    isLoading: false,
    hasNextPage: true,
    fetchNextPage: jest.fn(),
    isFetchingNextPage: false,
    userData: [],
  }),
}))

describe('<BodySearch />', () => {
  it('should render categories buttons by default', () => {
    render(<BodySearch />)

    expect(screen.getByTestId('categoriesButtons')).toBeOnTheScreen()
    expect(screen.queryByTestId('autocompleteList')).not.toBeOnTheScreen()
    expect(screen.queryByTestId('searchResults')).not.toBeOnTheScreen()
  })

  it('should render search results when asked', async () => {
    render(<BodySearch view={SearchView.Results} />)
    await act(async () => {})

    expect(screen.queryByTestId('categoriesButtons')).not.toBeOnTheScreen()
    expect(screen.queryByTestId('autocompleteList')).not.toBeOnTheScreen()
    expect(await screen.findByTestId('searchResults')).toBeOnTheScreen()
  })
})
