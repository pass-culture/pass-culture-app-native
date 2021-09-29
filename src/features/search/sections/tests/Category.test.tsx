import React from 'react'

import { CATEGORY_CRITERIA } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import { fireEvent, render } from 'tests/utils'

import { Category } from '../Category'

let mockSearchState = initialSearchState
const mockStagedDispatch = jest.fn()

jest.mock('features/search/pages/SearchWrapper', () => ({
  useStagedSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockStagedDispatch,
  }),
}))

jest.mock('features/home/api')

describe('Category component', () => {
  it('should not render "Toutes les catégories" categories but the rest', () => {
    const { queryByText } = render(<Category />)
    Object.values(CATEGORY_CRITERIA).map(({ label }) => {
      if (label === CATEGORY_CRITERIA.ALL.label) {
        expect(queryByText(label)).toBeFalsy()
      } else {
        expect(queryByText(label)).toBeTruthy()
      }
    })
  })

  it('should dispatch TOGGLE_CATEGORY with correct facetFilter', () => {
    const { getByText } = render(<Category />)
    fireEvent.press(getByText(CATEGORY_CRITERIA.CINEMA.label))
    expect(mockStagedDispatch).toHaveBeenCalledWith({
      type: 'TOGGLE_CATEGORY',
      payload: CATEGORY_CRITERIA.CINEMA.facetFilter,
    })
  })

  it('should have the indicator of the filters in the title', () => {
    mockSearchState = { ...initialSearchState, offerCategories: [] }
    expect(render(<Category />).queryByText('Catégories')).toBeTruthy()
    expect(render(<Category />).queryByText('Catégories\xa0(')).toBeFalsy()
    mockSearchState = { ...initialSearchState, offerCategories: ['CINEMA'] }
    expect(render(<Category />).queryByText('Catégories\xa0(1)')).toBeTruthy()
    mockSearchState = { ...initialSearchState, offerCategories: ['CINEMA', 'MEDIA'] }
    expect(render(<Category />).queryByText('Catégories\xa0(2)')).toBeTruthy()
  })
})
