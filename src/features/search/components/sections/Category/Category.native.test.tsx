import React from 'react'

import { GenreType, NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { initialSearchState } from 'features/search/context/reducer'
import { placeholderData as mockData } from 'libs/subcategories/placeholderData'
import { fireEvent, render } from 'tests/utils'

import { Category } from './Category'

let mockSearchState = initialSearchState

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

describe('Category component', () => {
  it('should render correctly', () => {
    expect(render(<Category />)).toMatchSnapshot()
  })

  it('should display the category when selected', () => {
    mockSearchState = { ...initialSearchState, offerCategories: [SearchGroupNameEnumv2.LIVRES] }
    const { getByText } = render(<Category />)

    expect(getByText('Livres')).toBeTruthy()
  })

  it('should display selected native category', () => {
    mockSearchState = {
      ...initialSearchState,
      offerCategories: [SearchGroupNameEnumv2.LIVRES],
      offerNativeCategories: [NativeCategoryIdEnumv2.LIVRES_PAPIER],
    }
    const { getByText } = render(<Category />)

    expect(getByText('Livres papier')).toBeTruthy()
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
    const { getByText } = render(<Category />)

    expect(getByText('Livres papier - Bandes dessinées')).toBeTruthy()
  })

  it('should open the categories filter modal when clicking on the category button', async () => {
    const { getByTestId } = render(<Category />, {
      theme: { isDesktopViewport: false, isMobileViewport: true },
    })
    const categoryButton = getByTestId('FilterRow')

    await fireEvent.press(categoryButton)

    const fullscreenModalScrollView = getByTestId('fullscreenModalScrollView')

    expect(fullscreenModalScrollView).toBeTruthy()
  })
})
