import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { initialSearchState } from 'features/search/pages/reducer'
import { CATEGORY_CRITERIA } from 'libs/algolia/enums'

import { Category } from '../Category'

let mockSearchState = initialSearchState
const mockDispatch = jest.fn()

jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
  }),
}))

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
  it('should dispatch CATEGORIES with correct facetFilter', () => {
    const { getByText } = render(<Category />)
    fireEvent.press(getByText(CATEGORY_CRITERIA.CINEMA.label))
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'CATEGORIES',
      payload: CATEGORY_CRITERIA.CINEMA.facetFilter,
    })
  })

  it('should have the indicator of the filters in the title', () => {
    mockSearchState = { ...initialSearchState, offerCategories: [] }
    expect(render(<Category />).queryByText('Catégories')).toBeTruthy()
    expect(render(<Category />).queryByText('Catégories\xa0(')).toBeFalsy()
    mockSearchState = { ...initialSearchState, offerCategories: ['CINEMA'] }
    expect(render(<Category />).queryByText('Catégories\xa0(1)')).toBeTruthy()
    mockSearchState = { ...initialSearchState, offerCategories: ['CINEMA', 'PRESSE'] }
    expect(render(<Category />).queryByText('Catégories\xa0(2)')).toBeTruthy()
  })
})
