import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { initialSearchState } from 'features/search/pages/reducer'
import { fireEvent, render, act } from 'tests/utils'

import { Categories } from '../Categories'

const mockSearchState = initialSearchState

jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
}))

const mockHideModal = jest.fn()

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

  it("should change the selected category filter when pressing on another filter's checkbox", async () => {
    const { getByText } = renderCategories()

    const someCategoryFilterCheckbox = getByText('Arts & loisirs créatifs')
    await act(async () => {
      fireEvent.press(someCategoryFilterCheckbox)
    })

    expect(someCategoryFilterCheckbox).toHaveProp('isSelected', true)
    const defaultCategoryFilterCheckbox = getByText('Toutes les catégories')
    expect(defaultCategoryFilterCheckbox).toHaveProp('isSelected', false)
  })

  it('should set the selected category filter on navigate when one is set', async () => {
    const { getByText } = renderCategories()

    const someCategoryFilterCheckbox = getByText('Arts & loisirs créatifs')
    await act(async () => {
      fireEvent.press(someCategoryFilterCheckbox)
    })
    const button = getByText('Rechercher')
    await act(async () => {
      fireEvent.press(button)
    })

    const expectedSearchParams = {
      ...initialSearchState,
      offerCategories: ['ARTS_LOISIRS_CREATIFS'],
    }
    expect(navigate).toHaveBeenCalledWith('TabNavigator', {
      params: expectedSearchParams,
      screen: 'Search',
    })
  })

  it('should set the selected category filter on navigate when none are set', async () => {
    const { getByText } = renderCategories()

    const someCategoryFilterCheckbox = getByText('Toutes les catégories')
    await act(async () => {
      fireEvent.press(someCategoryFilterCheckbox)
    })

    const button = getByText('Rechercher')
    await act(async () => {
      fireEvent.press(button)
    })

    const expectedSearchParams = { ...initialSearchState, offerCategories: [] }
    expect(navigate).toHaveBeenCalledWith('TabNavigator', {
      params: expectedSearchParams,
      screen: 'Search',
    })
  })

  it('should select default filter when pressing the reset button', async () => {
    const { getByText } = renderCategories()

    const button = getByText('Réinitialiser')

    await act(async () => {
      fireEvent.press(button)
    })

    const defaultCategoryFilterCheckbox = getByText('Toutes les catégories')

    expect(defaultCategoryFilterCheckbox).toHaveProp('isSelected', true)
  })

  describe('should close the modal ', () => {
    it('when pressing the search button', async () => {
      const { getByText } = renderCategories()

      const button = getByText('Rechercher')

      await act(async () => {
        fireEvent.press(button)
      })

      expect(mockHideModal).toHaveBeenCalled()
    })

    it('when pressing previous button', async () => {
      const { getByTestId } = renderCategories()

      const previousButton = getByTestId('backButton')

      await act(async () => {
        fireEvent.press(previousButton)
      })

      expect(mockHideModal).toHaveBeenCalled()
    })
  })
})

function renderCategories() {
  return render(
    <Categories
      title="Catégories"
      accessibilityLabel="Ne pas filtrer sur les catégories et retourner aux résultats"
      isVisible
      hideModal={mockHideModal}
    />
  )
}
