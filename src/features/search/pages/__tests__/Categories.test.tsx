import React from 'react'

import { SearchGroupNameEnum } from 'api/gen'
import { initialSearchState } from 'features/search/pages/reducer'
import { render } from 'tests/utils'

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
    const { toJSON } = renderCategories()
    expect(toJSON()).toMatchSnapshot()
  })

  it('should show all categories', () => {
    const { getByText } = renderCategories()
    expect(getByText('Toutes les catégories')).toBeTruthy()
    expect(getByText('Cinéma')).toBeTruthy()
    expect(getByText('Visites, expositions')).toBeTruthy()
    expect(getByText('Jeux')).toBeTruthy()
  })

  it('should match diff snapshot when new category is selected', () => {
    const allSelected = renderCategories().toJSON()

    mockSearchState.offerCategories = [SearchGroupNameEnum.CINEMA]
    const cinemaSelected = renderCategories().toJSON()
    expect(cinemaSelected).toMatchDiffSnapshot(allSelected)
  })
})

function renderCategories() {
  return render(<Categories />)
}
