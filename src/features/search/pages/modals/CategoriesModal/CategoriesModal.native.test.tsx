import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { GenreType, NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { initialSearchState } from 'features/search/context/reducer'
import { FilterBehaviour } from 'features/search/enums'
import { SearchState } from 'features/search/types'
import { analytics } from 'libs/firebase/analytics'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

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
      renderCategories()
      expect(screen.toJSON()).toMatchSnapshot()
    })

    it('should display arrows', () => {
      renderCategories()

      expect(screen.queryAllByLabelText('Affiner la recherche')).not.toHaveLength(0)
    })

    it('should show all categories', () => {
      renderCategories()
      expect(screen.getByText('Toutes les catégories')).toBeTruthy()
      expect(screen.getByText('Films, séries, cinéma')).toBeTruthy()
      expect(screen.getByText('Musées & visites culturelles')).toBeTruthy()
      expect(screen.getByText('Jeux & jeux vidéos')).toBeTruthy()
    })

    it('should not show categories when the backend returns no category', () => {
      mockData = { ...mockData, searchGroups: [] }
      renderCategories()
      expect(screen.getByText('Toutes les catégories')).toBeTruthy()
      expect(screen.queryByText('Films, séries, cinéma')).toBeFalsy()
      expect(screen.queryByText('Musées & visites culturelles')).toBeFalsy()
      expect(screen.queryByText('Jeux & jeux vidéos')).toBeFalsy()
    })

    it('should show only categories exisiting in categories return from backend', () => {
      mockData = {
        ...mockData,
        searchGroups: [
          { name: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA, value: 'Films, séries, cinéma' },
        ],
      }
      renderCategories()
      expect(screen.getByText('Toutes les catégories')).toBeTruthy()
      expect(screen.queryByText('Films, séries, cinéma')).toBeTruthy()
      expect(screen.queryByText('Musées & visites culturelles')).toBeFalsy()
      expect(screen.queryByText('Jeux & jeux vidéos')).toBeFalsy()
    })

    it('should set the selected category filter on navigate when one is set', async () => {
      renderCategories()

      const someCategoryFilterCheckbox = screen.getByText('Arts & loisirs créatifs')
      fireEvent.press(someCategoryFilterCheckbox)

      const button = screen.getByText('Rechercher')

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
      renderCategories()

      const someCategoryFilterCheckbox = screen.getByText('Toutes les catégories')
      fireEvent.press(someCategoryFilterCheckbox)

      const button = screen.getByText('Rechercher')
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
      renderCategories()

      const button = screen.getByText('Réinitialiser')
      fireEvent.press(button)

      await waitFor(() => {
        const defaultCategoryFilterCheckbox = screen.getByText('Toutes les catégories')
        expect(defaultCategoryFilterCheckbox).toHaveProp('isSelected', true)
      })
    })

    describe('should close the modal ', () => {
      it('when pressing the search button', async () => {
        renderCategories()

        const button = screen.getByText('Rechercher')
        fireEvent.press(button)

        await waitFor(() => {
          expect(mockHideModal).toHaveBeenCalledTimes(1)
        })
      })

      it('when pressing previous button', async () => {
        renderCategories()

        const previousButton = screen.getByTestId('Fermer')
        fireEvent.press(previousButton)

        await waitFor(() => {
          expect(mockHideModal).toHaveBeenCalledTimes(1)
        })
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
      renderCategories()

      expect(screen.getByText('Livres papier')).toBeTruthy()
    })

    it('should go back to categories view', () => {
      renderCategories({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
      })
      const previousButton = screen.getByTestId('Revenir en arrière')
      fireEvent.press(previousButton)
      expect(screen.getByText('Catégories')).toBeTruthy()
    })

    it('should navigate with correct search parameters when search button is pressed', async () => {
      renderCategories()

      const someCategoryFilterCheckbox = screen.getByText('Livres papier')
      fireEvent.press(someCategoryFilterCheckbox)

      const button = screen.getByText('Rechercher')

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
      renderCategories()

      const someCategoryFilterCheckbox = screen.getByText('Tout')
      fireEvent.press(someCategoryFilterCheckbox)

      const button = screen.getByText('Rechercher')
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
      renderCategories()

      const button = screen.getByText('Réinitialiser')
      fireEvent.press(button)

      await waitFor(() => {
        const defaultCategoryFilterCheckbox = screen.getByText('Toutes les catégories')
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
      renderCategories()

      fireEvent.press(screen.getByText('Livres papier'))
      expect(screen.getByText('Bandes dessinées')).toBeTruthy()
    })

    it('should go back to native categories view', () => {
      renderCategories({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
      })
      const previousButton = screen.getByTestId('Revenir en arrière')

      fireEvent.press(previousButton)
      expect(screen.getByText('Livres')).toBeTruthy()
    })

    it('should navigate with correct search parameters when search button is pressed', async () => {
      renderCategories()

      fireEvent.press(screen.getByText('Livres papier'))
      const someCategoryFilterCheckbox = screen.getByText('Bandes dessinées')
      fireEvent.press(someCategoryFilterCheckbox)

      const button = screen.getByText('Rechercher')

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
      renderCategories()

      fireEvent.press(screen.getByText('Livres papier'))
      const someCategoryFilterCheckbox = screen.getByText('Tout')
      fireEvent.press(someCategoryFilterCheckbox)

      const button = screen.getByText('Rechercher')
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
      renderCategories()

      fireEvent.press(screen.getByText('Livres papier'))
      fireEvent.press(screen.getByText('Bandes dessinées'))

      const button = screen.getByText('Réinitialiser')
      fireEvent.press(button)

      await waitFor(() => {
        const defaultCategoryFilterCheckbox = screen.getByText('Toutes les catégories')
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
      renderCategories()
      fireEvent.press(screen.getByTestId('Revenir en arrière'))
      fireEvent.press(screen.getByTestId('Revenir en arrière'))
      fireEvent.press(screen.getByText('Jeux & jeux vidéos'))

      const button = screen.getByText('Rechercher')
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
      renderCategories({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
      })

      await waitFor(() => {
        expect(screen.getByText('Appliquer le filtre')).toBeTruthy()
      })
    })

    it('should update search state when pressing submit button', async () => {
      renderCategories({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
      })
      fireEvent.press(screen.getByTestId('Revenir en arrière'))
      fireEvent.press(screen.getByTestId('Revenir en arrière'))
      fireEvent.press(screen.getByText('Jeux & jeux vidéos'))

      const searchButton = screen.getByText('Appliquer le filtre')
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

    it('should not log PerformSearch event when pressing button', async () => {
      renderCategories({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
      })
      fireEvent.press(screen.getByTestId('Revenir en arrière'))
      fireEvent.press(screen.getByTestId('Revenir en arrière'))
      const someCategoryFilterCheckbox = screen.getByText('Arts & loisirs créatifs')
      fireEvent.press(someCategoryFilterCheckbox)

      const button = screen.getByText('Appliquer le filtre')
      fireEvent.press(button)

      await waitFor(() => {
        expect(analytics.logPerformSearch).toHaveBeenCalledTimes(0)
      })
    })
  })

  describe('With "Rechercher" button', () => {
    it('should log PerformSearch event when pressing button', async () => {
      renderCategories()
      fireEvent.press(screen.getByTestId('Revenir en arrière'))
      fireEvent.press(screen.getByTestId('Revenir en arrière'))
      const someCategoryFilterCheckbox = screen.getByText('Arts & loisirs créatifs')
      fireEvent.press(someCategoryFilterCheckbox)

      const button = screen.getByText('Rechercher')
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

  describe('Modal header buttons', () => {
    it('should display back button on header when the modal is opening from general filter page', async () => {
      renderCategories({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
      })

      await waitFor(() => {
        expect(screen.getByTestId('Revenir en arrière')).toBeTruthy()
      })
    })

    it('should close the modal and general filter page when pressing close button when the modal is opening from general filter page', async () => {
      renderCategories({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
        onClose: mockOnClose,
      })

      const closeButton = screen.getByTestId('Fermer')
      fireEvent.press(closeButton)

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledTimes(1)
      })
    })

    it('should only close the modal when pressing close button when the modal is opening from search results', async () => {
      renderCategories()

      const closeButton = screen.getByTestId('Fermer')
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
