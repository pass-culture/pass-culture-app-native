import { render } from '@testing-library/react-native'
import React from 'react'

import { initialSearchState } from 'features/search/pages/reducer'

import { Categories } from '../Categories'

const mockSearchState = initialSearchState

jest.mock('features/search/pages/SearchWrapper', () => ({
  useStagedSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
}))

describe('Categories component', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<Categories />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should match diff snapshot when new category is selected', () => {
    const allSelected = render(<Categories />).toJSON()

    mockSearchState.offerCategories = ['CINEMA']
    const cinemaSelected = render(<Categories />).toJSON()
    expect(cinemaSelected).toMatchDiffSnapshot(allSelected)
  })
})
