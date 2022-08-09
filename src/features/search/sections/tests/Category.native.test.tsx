import React from 'react'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { CATEGORY_CRITERIA } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'
import { fireEvent, render, renderHook } from 'tests/utils'

import { Category } from '../Category'

let mockSearchState = initialSearchState
const mockStagedDispatch = jest.fn()

jest.mock('features/search/pages/SearchWrapper', () => ({
  useStagedSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockStagedDispatch,
  }),
}))

jest.mock('features/profile/api')

describe('Category component', () => {
  it('should not render "Toutes les catégories" categories but the rest', () => {
    const { result } = renderHook(useSearchGroupLabelMapping)
    const { queryByText } = render(<Category />)

    Object.keys(CATEGORY_CRITERIA).forEach((key) => {
      const searchGroup = key as SearchGroupNameEnumv2
      const label = result.current[searchGroup]
      if (searchGroup === SearchGroupNameEnumv2.NONE) {
        expect(queryByText(label)).toBeNull()
      } else {
        expect(queryByText(label)).toBeTruthy()
      }
    })
  })

  it('should dispatch TOGGLE_CATEGORY with correct facetFilter', () => {
    const { getByText } = render(<Category />)
    fireEvent.press(getByText('Films, séries, cinéma'))
    expect(mockStagedDispatch).toHaveBeenCalledWith({
      type: 'TOGGLE_CATEGORY',
      payload: CATEGORY_CRITERIA.FILMS_SERIES_CINEMA.facetFilter,
    })
  })

  it('should have the indicator of the filters in the title', () => {
    mockSearchState = { ...initialSearchState, offerCategories: [] }
    expect(render(<Category />).queryByText('Catégories')).toBeTruthy()
    expect(render(<Category />).queryByTestId('titleCount')).toBeNull()
    mockSearchState = {
      ...initialSearchState,
      offerCategories: [SearchGroupNameEnumv2.FILMS_SERIES_CINEMA],
    }
    expect(render(<Category />).queryByTestId('titleCount')?.children[0]).toContain('(1)')
    mockSearchState = {
      ...initialSearchState,
      offerCategories: [
        SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
        SearchGroupNameEnumv2.MEDIA_PRESSE,
      ],
    }
    expect(render(<Category />).queryByTestId('titleCount')?.children[0]).toContain('(2)')
  })
})
