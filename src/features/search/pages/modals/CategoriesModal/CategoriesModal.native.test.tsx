import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { GenreType, NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { initialSearchState } from 'features/search/context/reducer'
import { FilterBehaviour } from 'features/search/enums'
import { SearchState } from 'features/search/types'
import { analytics } from 'libs/firebase/analytics'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { fireEvent, render, waitFor } from 'tests/utils'

import { CategoriesModal, CategoriesModalProps } from './CategoriesModal'

const searchId = uuidv4()
const searchState = { ...initialSearchState, searchId }
let mockSearchState = searchState
const mockDispatch = jest.fn()
const mockOnClose = jest.fn()

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
  }),
}))

let mockData = placeholderData
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

const mockHideModal = jest.fn()

describe('<CategoriesModal/>', () => {
  afterEach(() => {
    mockData = placeholderData
  })
  describe('With categories view', () => {
    it('should render correctly', () => {
      const { toJSON } = renderCategories()
      expect(toJSON()).toMatchSnapshot()
    })

    it('should display arrows', () => {
      const { queryAllByLabelText } = renderCategories()

      expect(queryAllByLabelText('Affiner la recherche')).not.toHaveLength(0)
    })

    it('should show all categories', () => {
      const { getByText } = renderCategories()
      expect(getByText('Toutes les catégories')).toBeTruthy()
      expect(getByText('Films, séries, cinéma')).toBeTruthy()
      expect(getByText('Musées & visites culturelles')).toBeTruthy()
      expect(getByText('Jeux & jeux vidéos')).toBeTruthy()
    })

    it('should not show categories when the backend returns no category', () => {
      mockData = { ...mockData, searchGroups: [] }
      const { getByText, queryByText } = renderCategories()
      expect(getByText('Toutes les catégories')).toBeTruthy()
      expect(queryByText('Films, séries, cinéma')).toBeFalsy()
      expect(queryByText('Musées & visites culturelles')).toBeFalsy()
      expect(queryByText('Jeux & jeux vidéos')).toBeFalsy()
    })

    it('should show only categories exisiting in categories return from backend', () => {
      mockData = {
        ...mockData,
        searchGroups: [
          { name: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA, value: 'Films, séries, cinéma' },
        ],
      }
      const { getByText, queryByText } = renderCategories()
      expect(getByText('Toutes les catégories')).toBeTruthy()
      expect(queryByText('Films, séries, cinéma')).toBeTruthy()
      expect(queryByText('Musées & visites culturelles')).toBeFalsy()
      expect(queryByText('Jeux & jeux vidéos')).toBeFalsy()
    })

    it('should set the selected category filter on navigate when one is set', async () => {
      const { getByText } = renderCategories()

      const someCategoryFilterCheckbox = getByText('Arts & loisirs créatifs')
      fireEvent.press(someCategoryFilterCheckbox)

      const button = getByText('Rechercher')

      fireEvent.press(button)

      const expectedSearchParams: SearchState = {
        ...searchState,
        offerCategories: [SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS],
        offerNativeCategories: [],
        offerGenreTypes: [],
      }
      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith('TabNavigator', {
          params: expectedSearchParams,
          screen: 'Search',
        })
      })
    })

    it('should set the selected category filter on navigate when none are set', async () => {
      const { getByText } = renderCategories()

      const someCategoryFilterCheckbox = getByText('Toutes les catégories')
      fireEvent.press(someCategoryFilterCheckbox)

      const button = getByText('Rechercher')
      fireEvent.press(button)

      const expectedSearchParams: SearchState = {
        ...searchState,
        offerCategories: [],
        offerNativeCategories: [],
        offerGenreTypes: [],
      }
      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith('TabNavigator', {
          params: expectedSearchParams,
          screen: 'Search',
        })
      })
    })

    it('should select default filter when pressing the reset button', async () => {
      const { getByText } = renderCategories()

      const button = getByText('Réinitialiser')
      fireEvent.press(button)

      await waitFor(() => {
        const defaultCategoryFilterCheckbox = getByText('Toutes les catégories')
        expect(defaultCategoryFilterCheckbox).toHaveProp('isSelected', true)
      })
    })

    describe('should close the modal ', () => {
      it('when pressing the search button', async () => {
        const { getByText } = renderCategories()

        const button = getByText('Rechercher')
        fireEvent.press(button)

        await waitFor(() => {
          expect(mockHideModal).toHaveBeenCalledTimes(1)
        })
      })

      it('when pressing previous button', async () => {
        const { getByTestId } = renderCategories()

        const previousButton = getByTestId('Fermer')
        fireEvent.press(previousButton)

        await waitFor(() => {
          expect(mockHideModal).toHaveBeenCalledTimes(1)
        })
      })
    })

    it('should log PerformSearch event when pressing search button', async () => {
      const { getByText } = renderCategories()

      const someCategoryFilterCheckbox = getByText('Arts & loisirs créatifs')
      fireEvent.press(someCategoryFilterCheckbox)

      const button = getByText('Rechercher')
      fireEvent.press(button)

      const expectedSearchParams: SearchState = {
        ...searchState,
        offerCategories: [SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS],
        offerNativeCategories: [],
        offerGenreTypes: [],
      }
      await waitFor(() => {
        expect(analytics.logPerformSearch).toHaveBeenCalledWith(expectedSearchParams)
      })
    })
  })

  describe('With native categories view', () => {
    beforeAll(() => {
      mockSearchState = {
        ...searchState,
        offerCategories: [SearchGroupNameEnumv2.LIVRES],
        offerNativeCategories: [],
        offerGenreTypes: [],
      }
    })

    it('should render native categories', () => {
      const { getByText } = renderCategories()
      fireEvent.press(getByText('Livres'))

      expect(getByText('Livres papier')).toBeTruthy()
    })

    it('should handle "CARTES JEUNES" special case correctly', () => {
      const { getByText, queryAllByText } = renderCategories()
      fireEvent.press(getByText('Cartes jeunes'))

      expect(queryAllByText('Cartes jeunes')).toHaveLength(2)
    })

    it('should go back to categories view', () => {
      const { getByTestId, getByText } = renderCategories({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
      })
      const previousButton = getByTestId('Revenir en arrière')
      fireEvent.press(getByText('Livres'))

      fireEvent.press(previousButton)
      expect(getByText('Catégories')).toBeTruthy()
    })

    it('should navigate with correct search parameters when search button is pressed', async () => {
      const { getByText } = renderCategories()
      fireEvent.press(getByText('Livres'))

      const someCategoryFilterCheckbox = getByText('Livres papier')
      fireEvent.press(someCategoryFilterCheckbox)

      const button = getByText('Rechercher')

      fireEvent.press(button)

      const expectedSearchParams: SearchState = {
        ...searchState,
        offerCategories: [SearchGroupNameEnumv2.LIVRES],
        offerNativeCategories: [NativeCategoryIdEnumv2.LIVRES_PAPIER],
        offerGenreTypes: [],
      }
      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith('TabNavigator', {
          params: expectedSearchParams,
          screen: 'Search',
        })
      })
    })

    it('should remove offerNativeCategories filter when none is set', async () => {
      const { getByText } = renderCategories()
      fireEvent.press(getByText('Livres'))

      const someCategoryFilterCheckbox = getByText('Tout')
      fireEvent.press(someCategoryFilterCheckbox)

      const button = getByText('Rechercher')
      fireEvent.press(button)

      const expectedSearchParams: SearchState = {
        ...searchState,
        offerCategories: [SearchGroupNameEnumv2.LIVRES],
        offerNativeCategories: [],
        offerGenreTypes: [],
      }
      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith('TabNavigator', {
          params: expectedSearchParams,
          screen: 'Search',
        })
      })
    })

    it('should reset filters and come back on categories view', async () => {
      const { getByText } = renderCategories()
      fireEvent.press(getByText('Livres'))

      const button = getByText('Réinitialiser')
      fireEvent.press(button)

      await waitFor(() => {
        const defaultCategoryFilterCheckbox = getByText('Toutes les catégories')
        expect(defaultCategoryFilterCheckbox).toHaveProp('isSelected', true)
      })
    })
  })

  describe('With genre types view', () => {
    beforeAll(() => {
      mockSearchState = {
        ...searchState,
        offerCategories: [SearchGroupNameEnumv2.LIVRES],
        offerNativeCategories: [NativeCategoryIdEnumv2.LIVRES_PAPIER],
      }
    })

    it('should render genre types', () => {
      const { getByText } = renderCategories()
      fireEvent.press(getByText('Livres'))
      fireEvent.press(getByText('Livres papier'))

      expect(getByText('Bandes dessinées')).toBeTruthy()
    })

    it('should go back to native categories view', () => {
      const { getByTestId, getByText } = renderCategories({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
      })
      const previousButton = getByTestId('Revenir en arrière')
      fireEvent.press(getByText('Livres'))
      fireEvent.press(getByText('Livres papier'))

      fireEvent.press(previousButton)
      expect(getByText('Livres')).toBeTruthy()
    })

    it('should navigate with correct search parameters when search button is pressed', async () => {
      const { getByText } = renderCategories()
      fireEvent.press(getByText('Livres'))
      fireEvent.press(getByText('Livres papier'))

      const someCategoryFilterCheckbox = getByText('Bandes dessinées')
      fireEvent.press(someCategoryFilterCheckbox)

      const button = getByText('Rechercher')

      fireEvent.press(button)

      const expectedSearchParams: SearchState = {
        ...searchState,
        offerCategories: [SearchGroupNameEnumv2.LIVRES],
        offerNativeCategories: [NativeCategoryIdEnumv2.LIVRES_PAPIER],
        offerGenreTypes: [
          { key: GenreType.BOOK, value: 'Bandes dessinées', name: 'Bandes dessinées' },
        ],
      }
      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith('TabNavigator', {
          params: expectedSearchParams,
          screen: 'Search',
        })
      })
    })

    it('should remove offerGenreTypes filter when none is set', async () => {
      const { getByText } = renderCategories()
      fireEvent.press(getByText('Livres'))
      fireEvent.press(getByText('Livres papier'))

      const someCategoryFilterCheckbox = getByText('Tout')
      fireEvent.press(someCategoryFilterCheckbox)

      const button = getByText('Rechercher')
      fireEvent.press(button)

      const expectedSearchParams: SearchState = {
        ...searchState,
        offerCategories: [SearchGroupNameEnumv2.LIVRES],
        offerNativeCategories: [NativeCategoryIdEnumv2.LIVRES_PAPIER],
        offerGenreTypes: [],
      }
      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith('TabNavigator', {
          params: expectedSearchParams,
          screen: 'Search',
        })
      })
    })

    it('should reset filters and come back on categories view', async () => {
      const { getByText } = renderCategories()
      fireEvent.press(getByText('Livres'))
      fireEvent.press(getByText('Livres papier'))
      fireEvent.press(getByText('Bandes dessinées'))

      const button = getByText('Réinitialiser')
      fireEvent.press(button)

      await waitFor(() => {
        const defaultCategoryFilterCheckbox = getByText('Toutes les catégories')
        expect(defaultCategoryFilterCheckbox).toHaveProp('isSelected', true)
      })
    })

    it('should filter on category, native category and genre/type then only on category with all native categories', async () => {
      useRoute.mockReturnValueOnce({
        params: {
          offerCategories: [SearchGroupNameEnumv2.LIVRES],
          offerNativeCategories: [NativeCategoryIdEnumv2.LIVRES_PAPIER],
          offerGenreTypes: ['Bandes dessinées'],
        },
      })
      const { getByText } = renderCategories()
      fireEvent.press(getByText('Jeux & jeux vidéos'))

      const button = getByText('Rechercher')
      fireEvent.press(button)

      const expectedSearchParams: SearchState = {
        ...searchState,
        offerCategories: [SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS],
        offerNativeCategories: [],
        offerGenreTypes: [],
      }
      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith('TabNavigator', {
          params: expectedSearchParams,
          screen: 'Search',
        })
      })
    })
  })

  describe('with "Appliquer le filtre" button', () => {
    it('should display alternative button title', async () => {
      const { getByText } = renderCategories({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
      })

      await waitFor(() => {
        expect(getByText('Appliquer le filtre')).toBeTruthy()
      })
    })

    it('should update search state when pressing submit button', async () => {
      const { getByText } = renderCategories({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
      })

      fireEvent.press(getByText('Jeux & jeux vidéos'))

      const searchButton = getByText('Appliquer le filtre')
      fireEvent.press(searchButton)

      const expectedSearchParams: SearchState = {
        ...searchState,
        offerCategories: [SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS],
        offerNativeCategories: [],
        offerGenreTypes: [],
      }

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'SET_STATE',
          payload: expectedSearchParams,
        })
      })
    })
  })

  describe('Modal header buttons', () => {
    it('should display back button on header when the modal is opening from general filter page', async () => {
      const { getByTestId } = renderCategories({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
      })

      await waitFor(() => {
        expect(getByTestId('Revenir en arrière')).toBeTruthy()
      })
    })

    it('should close the modal and general filter page when pressing close button when the modal is opening from general filter page', async () => {
      const { getByTestId } = renderCategories({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
        onClose: mockOnClose,
      })

      const closeButton = getByTestId('Fermer')
      fireEvent.press(closeButton)

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledTimes(1)
      })
    })

    it('should only close the modal when pressing close button when the modal is opening from search results', async () => {
      const { getByTestId } = renderCategories()

      const closeButton = getByTestId('Fermer')
      fireEvent.press(closeButton)

      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })
})

function renderCategories({
  filterBehaviour = FilterBehaviour.SEARCH,
  onClose,
  ...props
}: Partial<CategoriesModalProps> = {}) {
  return render(
    <CategoriesModal
      accessibilityLabel="Ne pas filtrer sur les catégories et retourner aux résultats"
      isVisible
      hideModal={mockHideModal}
      filterBehaviour={filterBehaviour}
      onClose={onClose}
      {...props}
    />
  )
}
