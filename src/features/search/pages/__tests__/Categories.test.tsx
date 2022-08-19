import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import { initialSearchState } from 'features/search/pages/reducer'
import { fireEvent, render } from 'tests/utils'

import { Categories } from '../Categories'

const mockSearchState = initialSearchState

jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
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

  it('should set the selected category filter on navigate when one is set', () => {
    const { getByText } = renderCategories()

    const someCategoryFilterCheckbox = getByText('Arts & loisirs créatifs')
    fireEvent.press(someCategoryFilterCheckbox)
    const button = getByText('Rechercher')
    fireEvent.press(button)

    const expectedSearchParams = {
      ...initialSearchState,
      offerCategories: ['ARTS_LOISIRS_CREATIFS'],
    }
    expect(navigate).toHaveBeenCalledWith('TabNavigator', {
      params: expectedSearchParams,
      screen: 'Search',
    })
  })

  it('should set the selected category filter on navigate when none are set', () => {
    const { getByText } = renderCategories()

    const someCategoryFilterCheckbox = getByText('Toutes les catégories')
    fireEvent.press(someCategoryFilterCheckbox)
    const button = getByText('Rechercher')
    fireEvent.press(button)

    const expectedSearchParams = { ...initialSearchState, offerCategories: [] }
    expect(navigate).toHaveBeenCalledWith('TabNavigator', {
      params: expectedSearchParams,
      screen: 'Search',
    })
  })

  it('should select default filter when pressing the reset button', () => {
    const { getByText } = renderCategories()

    const button = getByText('Réinitialiser')
    fireEvent.press(button)
    const defaultCategoryFilterCheckbox = getByText('Toutes les catégories')

    expect(defaultCategoryFilterCheckbox).toHaveProp('isSelected', true)
  })
})

function renderCategories() {
  return render(<Categories />)
}
