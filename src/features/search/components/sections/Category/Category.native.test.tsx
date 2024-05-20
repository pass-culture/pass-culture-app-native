import React from 'react'

import { GenreType, NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { initialSearchState } from 'features/search/context/reducer'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { PLACEHOLDER_DATA as mockData } from 'libs/subcategories/placeholderData'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

import { Category } from './Category'

let mockSearchState = initialSearchState

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
}))

jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

jest.mock('features/profile/api/useUpdateProfileMutation')

const mockHasNextPage = true
const mockFetchNextPage = jest.fn()
jest.mock('features/search/api/useSearchResults/useSearchResults', () => ({
  useSearchResults: () => ({
    data: mockData,
    hits: [],
    nbHits: 0,
    isFetching: false,
    isLoading: false,
    hasNextPage: mockHasNextPage,
    fetchNextPage: mockFetchNextPage,
    isFetchingNextPage: false,
  }),
}))

describe('Category component', () => {
  it('should render correctly', () => {
    expect(render(<Category />)).toMatchSnapshot()
  })

  it('should display the category when selected', () => {
    mockSearchState = {
      ...initialSearchState,
      offerCategories: [SearchGroupNameEnumv2.LIVRES],
    }
    render(<Category />)

    expect(screen.getByText('Livres')).toBeOnTheScreen()
  })

  it('should display selected native category', () => {
    mockSearchState = {
      ...initialSearchState,
      offerCategories: [SearchGroupNameEnumv2.LIVRES],
      offerNativeCategories: [NativeCategoryIdEnumv2.LIVRES_PAPIER],
    }
    render(<Category />)

    expect(screen.getByText('Livres papier')).toBeOnTheScreen()
  })

  it('should display selected genre', () => {
    mockSearchState = {
      ...initialSearchState,
      offerCategories: [SearchGroupNameEnumv2.LIVRES],
      offerNativeCategories: [NativeCategoryIdEnumv2.LIVRES_PAPIER],
      offerGenreTypes: [
        { key: GenreType.BOOK, name: 'Bandes dessinées', value: 'Bandes dessinées' },
      ],
    }
    render(<Category />)

    expect(screen.getByText('Livres papier - Bandes dessinées')).toBeOnTheScreen()
  })

  it('should open the categories filter modal when clicking on the category button', async () => {
    render(<Category />, {
      theme: { isDesktopViewport: false, isMobileViewport: true },
    })

    const categoryButton = screen.getByTestId('FilterRow')

    fireEvent.press(categoryButton)

    let fullscreenModalScrollView
    await waitFor(() => {
      fullscreenModalScrollView = screen.getByTestId('fullscreenModalScrollView')
    })

    expect(fullscreenModalScrollView).toBeOnTheScreen()
  })
})
