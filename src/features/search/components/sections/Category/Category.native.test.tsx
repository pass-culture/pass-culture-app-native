import React from 'react'

import { GenreType, NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { ALL_CATEGORIES_LABEL } from 'features/search/constants'
import { initialSearchState } from 'features/search/context/reducer'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { PLACEHOLDER_DATA as mockData } from 'libs/subcategories/placeholderData'
import { screen, waitFor, userEvent, renderAsync } from 'tests/utils'

import { Category } from './Category'

let mockSearchState = initialSearchState

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
}))

jest.mock('queries/subcategories/useSubcategoriesQuery', () => ({
  useSubcategoriesQuery: () => ({
    data: mockData,
  }),
}))

jest.mock('queries/profile/usePatchProfileMutation')

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

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('Category component', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should display the category when selected', async () => {
    mockSearchState = {
      ...initialSearchState,
      offerCategories: [SearchGroupNameEnumv2.LIVRES],
    }
    await renderAsync(<Category />)

    expect(screen.getByText('Livres')).toBeOnTheScreen()
  })

  it('should display selected native category', async () => {
    mockSearchState = {
      ...initialSearchState,
      offerCategories: [SearchGroupNameEnumv2.LIVRES],
      offerNativeCategories: [NativeCategoryIdEnumv2.LIVRES_PAPIER],
    }
    await renderAsync(<Category />)

    expect(screen.getByText('Livres papier')).toBeOnTheScreen()
  })

  it('should display selected genre', async () => {
    mockSearchState = {
      ...initialSearchState,
      offerCategories: [SearchGroupNameEnumv2.LIVRES],
      offerNativeCategories: [NativeCategoryIdEnumv2.LIVRES_PAPIER],
      offerGenreTypes: [
        { key: GenreType.BOOK, name: 'Bandes dessinées', value: 'Bandes dessinées' },
      ],
    }
    await renderAsync(<Category />)

    expect(screen.getByText('Livres papier - Bandes dessinées')).toBeOnTheScreen()
  })

  it('should open the categories filter modal when clicking on the category button', async () => {
    await renderAsync(<Category />, {
      theme: { isDesktopViewport: false, isMobileViewport: true },
    })

    const categoryButton = screen.getByTestId('FilterRow')

    await user.press(categoryButton)

    let fullscreenModalScrollView
    await waitFor(() => {
      fullscreenModalScrollView = screen.getByTestId('fullscreenModalScrollView')
    })

    expect(fullscreenModalScrollView).toBeOnTheScreen()
  })

  it('should display `Toutes les catégories` when none is selected', async () => {
    mockSearchState = {
      ...initialSearchState,
      offerCategories: [],
    }
    await renderAsync(<Category />)

    expect(await screen.findByText(ALL_CATEGORIES_LABEL)).toBeOnTheScreen()
  })
})
