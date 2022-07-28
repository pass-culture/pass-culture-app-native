import React from 'react'

import { SearchGroupNameEnumv2 } from 'api/gen'
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
    expect(getByText('Films, séries, cinéma')).toBeTruthy()
    expect(getByText('Musées & visites culturelles')).toBeTruthy()
    expect(getByText('Jeux & jeux vidéos')).toBeTruthy()
  })

  it('should match diff snapshot when new category is selected', () => {
    const allSelected = renderCategories().toJSON()

    mockSearchState.offerCategories = [SearchGroupNameEnumv2.FILMS_SERIES_CINEMA]
    const cinemaSelected = renderCategories().toJSON()
    expect(cinemaSelected).toMatchDiffSnapshot(allSelected)
  })
})

function renderCategories() {
  return render(<Categories />)
}
