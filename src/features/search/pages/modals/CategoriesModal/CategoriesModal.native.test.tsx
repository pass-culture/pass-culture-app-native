import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { navigate } from '__mocks__/@react-navigation/native'
import { initialSearchState } from 'features/search/context/reducer'
import { SectionTitle } from 'features/search/helpers/titles'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render, act } from 'tests/utils'

import { CategoriesModal } from './CategoriesModal'

const searchId = uuidv4()
const searchState = { ...initialSearchState, searchId }
const mockSearchState = searchState

jest.mock('features/search/context/SearchWrapper', () => ({
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
      ...searchState,
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

    const expectedSearchParams = { ...searchState, offerCategories: [] }
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

      expect(mockHideModal).toHaveBeenCalledTimes(1)
    })

    it('when pressing previous button', async () => {
      const { getByTestId } = renderCategories()

      const previousButton = getByTestId('backButton')

      await act(async () => {
        fireEvent.press(previousButton)
      })

      expect(mockHideModal).toHaveBeenCalledTimes(1)
    })
  })

  it('should log event when pressing search button', async () => {
    const { getByText } = renderCategories()

    const someCategoryFilterCheckbox = getByText('Arts & loisirs créatifs')
    await act(async () => {
      fireEvent.press(someCategoryFilterCheckbox)
    })
    const button = getByText('Rechercher')
    await act(async () => {
      fireEvent.press(button)
    })

    expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.Category, searchId)
  })
})

function renderCategories() {
  return render(
    <CategoriesModal
      title="Catégories"
      accessibilityLabel="Ne pas filtrer sur les catégories et retourner aux résultats"
      isVisible
      hideModal={mockHideModal}
    />
  )
}
