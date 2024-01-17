import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { GenreType, NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { initialSearchState } from 'features/search/context/reducer'
import { FilterBehaviour } from 'features/search/enums'
import { OfferGenreType, SearchState } from 'features/search/types'
import { FacetData } from 'libs/algolia'
import { mockedFacets } from 'libs/algolia/__mocks__/mockedFacets'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
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

const mockUseFeatureFlag = jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(true)

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

      expect(screen.getByText('Toutes les catégories')).toBeOnTheScreen()
      expect(screen.getByText('Cinéma, films et séries')).toBeOnTheScreen()
      expect(screen.getByText('Musées & visites culturelles')).toBeOnTheScreen()
      expect(screen.getByText('Jeux & jeux vidéos')).toBeOnTheScreen()
    })

    it('should not show categories when the backend returns no category', () => {
      mockData = { ...mockData, searchGroups: [] }
      renderCategories()

      expect(screen.getByText('Toutes les catégories')).toBeOnTheScreen()
      expect(screen.queryByText('Cinéma, films et séries')).not.toBeOnTheScreen()
      expect(screen.queryByText('Musées & visites culturelles')).not.toBeOnTheScreen()
      expect(screen.queryByText('Jeux & jeux vidéos')).not.toBeOnTheScreen()
    })

    it('should show only categories exisiting in categories return from backend', () => {
      mockData = {
        ...mockData,
        searchGroups: [
          { name: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA, value: 'Cinéma, films et séries' },
        ],
      }
      renderCategories()

      expect(screen.getByText('Toutes les catégories')).toBeOnTheScreen()
      expect(screen.queryByText('Cinéma, films et séries')).toBeOnTheScreen()
      expect(screen.queryByText('Musées & visites culturelles')).not.toBeOnTheScreen()
      expect(screen.queryByText('Jeux & jeux vidéos')).not.toBeOnTheScreen()
    })

    it('should set the selected category filter when search button is pressed and a category was already set', async () => {
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
        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'SET_STATE',
          payload: expectedSearchParams,
        })
      })
    })

    it('should set the selected category filter when search button is pressed and no category was already set', async () => {
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
        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'SET_STATE',
          payload: expectedSearchParams,
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

    describe('should close the modal', () => {
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

      expect(screen.getByText('Livres papier')).toBeOnTheScreen()
    })

    it('should go back to categories view', () => {
      renderCategories({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
      })
      const previousButton = screen.getByTestId('Revenir en arrière')
      fireEvent.press(previousButton)

      expect(screen.getByText('Catégories')).toBeOnTheScreen()
    })

    it('should set search state when search button is pressed', async () => {
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
        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'SET_STATE',
          payload: expectedSearchParams,
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
        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'SET_STATE',
          payload: expectedSearchParams,
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

    describe('When wipDisplaySearchNbFacetResults feature flag is activated', () => {
      beforeAll(() => {
        mockUseFeatureFlag.mockReturnValue(true)
      })

      it('should display number of results on each category', () => {
        renderCategories()

        // Festivals du livre + Livres audio physiques
        expect(screen.getAllByText('0')).toHaveLength(2)
        // Livres numériques & audio
        expect(screen.getByText('23')).toBeOnTheScreen()
        // Livre Papiers
        expect(screen.getByText('4494')).toBeOnTheScreen()
      })
    })

    describe('When wipDisplaySearchNbFacetResults feature flag is not activated', () => {
      beforeAll(() => {
        mockUseFeatureFlag.mockReturnValue(false)
      })

      it('should not display number of results on each category', () => {
        renderCategories()

        // Festivals du livre + Livres audio physiques
        expect(screen.queryAllByText('0 résultat')).toHaveLength(0)

        // Livres numériques & audio
        expect(screen.queryByText('23 résultats')).not.toBeOnTheScreen()
        // Livre Papiers
        expect(screen.queryByText('+100 résultats')).not.toBeOnTheScreen()
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

      expect(screen.getByText('Bandes dessinées')).toBeOnTheScreen()
    })

    it('should go back to native categories view', () => {
      renderCategories({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
      })
      const previousButton = screen.getByTestId('Revenir en arrière')

      fireEvent.press(previousButton)

      expect(screen.getByText('Livres')).toBeOnTheScreen()
    })

    it('should set search state when search button is pressed', async () => {
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
        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'SET_STATE',
          payload: expectedSearchParams,
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
        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'SET_STATE',
          payload: expectedSearchParams,
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
      mockSearchState = {
        ...mockSearchState,
        offerCategories: [SearchGroupNameEnumv2.LIVRES],
        offerNativeCategories: [NativeCategoryIdEnumv2.LIVRES_PAPIER],
        offerGenreTypes: ['Bandes dessinées'] as unknown as OfferGenreType[],
      }
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
        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'SET_STATE',
          payload: expectedSearchParams,
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
        expect(screen.getByText('Appliquer le filtre')).toBeOnTheScreen()
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
  })

  describe('Modal header buttons', () => {
    it('should display back button on header when the modal is opening from general filter page', async () => {
      renderCategories({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
      })

      await waitFor(() => {
        expect(screen.getByTestId('Revenir en arrière')).toBeOnTheScreen()
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
      facets={mockedFacets.facets as FacetData}
      {...props}
    />
  )
}
