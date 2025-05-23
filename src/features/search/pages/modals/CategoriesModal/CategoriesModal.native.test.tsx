import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { GenreType, NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { ALL_CATEGORIES_LABEL } from 'features/search/constants'
import { initialSearchState } from 'features/search/context/reducer'
import { FilterBehaviour } from 'features/search/enums'
import { BooksNativeCategoriesEnum, SearchState } from 'features/search/types'
import { algoliaFacets } from 'libs/algolia/fixtures/algoliaFacets'
import { FacetData } from 'libs/algolia/types'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { render, screen, userEvent, waitFor } from 'tests/utils'

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

let mockData = PLACEHOLDER_DATA
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

const mockHideModal = jest.fn()

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('<CategoriesModal/>', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  afterEach(() => {
    mockData = PLACEHOLDER_DATA
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

      expect(screen.getByText(ALL_CATEGORIES_LABEL)).toBeOnTheScreen()
      expect(screen.getByText('Cinéma')).toBeOnTheScreen()
      expect(screen.getByText('Musées & visites culturelles')).toBeOnTheScreen()
      expect(screen.getByText('Jeux & jeux vidéos')).toBeOnTheScreen()
    })

    it('should not show categories when the backend returns no category', () => {
      mockData = { ...mockData, searchGroups: [] }
      renderCategories()

      expect(screen.getByText(ALL_CATEGORIES_LABEL)).toBeOnTheScreen()
      expect(screen.queryByText('Cinéma')).not.toBeOnTheScreen()
      expect(screen.queryByText('Musées & visites culturelles')).not.toBeOnTheScreen()
      expect(screen.queryByText('Jeux & jeux vidéos')).not.toBeOnTheScreen()
    })

    it('should show only categories exisiting in categories return from backend', () => {
      mockData = {
        ...mockData,
        searchGroups: [{ name: SearchGroupNameEnumv2.CINEMA, value: 'Cinéma' }],
      }
      renderCategories()

      expect(screen.getByText(ALL_CATEGORIES_LABEL)).toBeOnTheScreen()
      expect(screen.getByText('Cinéma')).toBeOnTheScreen()
      expect(screen.queryByText('Musées & visites culturelles')).not.toBeOnTheScreen()
      expect(screen.queryByText('Jeux & jeux vidéos')).not.toBeOnTheScreen()
    })

    it('should set the selected category filter when search button is pressed and a category was already set', async () => {
      renderCategories()

      const someCategoryFilterCheckbox = screen.getByText('Arts & loisirs créatifs')
      await user.press(someCategoryFilterCheckbox)

      const button = screen.getByText('Rechercher')

      await user.press(button)

      const expectedSearchParams: SearchState = {
        ...searchState,
        offerCategories: [SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS],
        offerNativeCategories: [],
        offerGenreTypes: [],
      }

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_STATE',
        payload: expectedSearchParams,
      })
    })

    it('should set the selected category filter when search button is pressed and no category was already set', async () => {
      renderCategories()

      const someCategoryFilterCheckbox = screen.getByText(ALL_CATEGORIES_LABEL)
      await user.press(someCategoryFilterCheckbox)

      const button = screen.getByText('Rechercher')
      await user.press(button)

      const expectedSearchParams: SearchState = {
        ...searchState,
        offerCategories: [],
        offerNativeCategories: [],
        offerGenreTypes: [],
      }

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_STATE',
        payload: expectedSearchParams,
      })
    })

    it('should select default filter when pressing the reset button', async () => {
      renderCategories()

      const button = await screen.findByText('Réinitialiser')
      await user.press(button)

      const defaultCategoryFilterCheckbox = await screen.findByText(ALL_CATEGORIES_LABEL)

      expect(defaultCategoryFilterCheckbox).toHaveProp('isSelected', true)
    })

    describe('should close the modal', () => {
      it('when pressing the search button', async () => {
        renderCategories()

        const button = screen.getByText('Rechercher')
        await user.press(button)

        expect(mockHideModal).toHaveBeenCalledTimes(1)
      })

      it('when pressing previous button', async () => {
        renderCategories()

        const previousButton = screen.getByTestId('Fermer')
        await user.press(previousButton)

        expect(mockHideModal).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('With native categories view', () => {
    beforeAll(() => {
      mockSearchState = {
        ...searchState,
        offerCategories: [SearchGroupNameEnumv2.CINEMA],
        offerNativeCategories: [],
        offerGenreTypes: [],
      }
    })

    it('should render native categories', () => {
      renderCategories()

      expect(screen.getByText('Films à l’affiche')).toBeOnTheScreen()
    })

    it('should go back to categories view', async () => {
      renderCategories({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
      })
      const previousButton = screen.getByTestId('Revenir en arrière')
      await user.press(previousButton)

      expect(screen.getByText('Catégories')).toBeOnTheScreen()
    })

    it('should set search state when search button is pressed', async () => {
      renderCategories()

      const someCategoryFilterCheckbox = screen.getByText('Films à l’affiche')
      await user.press(someCategoryFilterCheckbox)

      const button = screen.getByText('Rechercher')
      await user.press(button)

      const expectedSearchParams: SearchState = {
        ...searchState,
        offerCategories: [SearchGroupNameEnumv2.CINEMA],
        offerNativeCategories: [NativeCategoryIdEnumv2.SEANCES_DE_CINEMA],
        offerGenreTypes: [],
      }

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_STATE',
        payload: expectedSearchParams,
      })
    })

    it('should remove offerNativeCategories filter when none is set', async () => {
      renderCategories()

      const someCategoryFilterCheckbox = screen.getByText('Tout')
      await user.press(someCategoryFilterCheckbox)

      const button = screen.getByText('Rechercher')
      await user.press(button)

      const expectedSearchParams: SearchState = {
        ...searchState,
        offerCategories: [SearchGroupNameEnumv2.CINEMA],
        offerNativeCategories: [],
        offerGenreTypes: [],
      }

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_STATE',
        payload: expectedSearchParams,
      })
    })

    it('should reset filters and come back on categories view', async () => {
      renderCategories()

      const button = screen.getByText('Réinitialiser')
      await user.press(button)

      const defaultCategoryFilterCheckbox = screen.getByText(ALL_CATEGORIES_LABEL)

      expect(defaultCategoryFilterCheckbox).toHaveProp('isSelected', true)
    })

    it('should execute search when pressing reset button', async () => {
      renderCategories()

      const button = await screen.findByText('Réinitialiser')
      await user.press(button)

      const expectedSearchParams: SearchState = {
        ...searchState,
        offerCategories: [],
        offerNativeCategories: [],
        offerGenreTypes: [],
      }

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_STATE',
        payload: expectedSearchParams,
      })
    })

    describe('When wipDisplaySearchNbFacetResults feature flag is activated', () => {
      beforeEach(() => {
        setFeatureFlags([RemoteStoreFeatureFlags.WIP_DISPLAY_SEARCH_NB_FACET_RESULTS])
      })

      it('should display number of results on each category', () => {
        renderCategories()

        // Cartes cinéma
        expect(screen.getByText('7')).toBeOnTheScreen()
        // Séances de cinéma
        expect(screen.getByText('54')).toBeOnTheScreen()
      })
    })

    describe('When wipDisplaySearchNbFacetResults feature flag is not activated', () => {
      beforeEach(() => {
        setFeatureFlags()
      })

      it('should not display number of results on each category', () => {
        renderCategories()

        // Cartes cinéma
        expect(screen.queryByText('7')).not.toBeOnTheScreen()
        // Séances de cinéma
        expect(screen.queryByText('54')).not.toBeOnTheScreen()
      })
    })
  })

  describe('new book native categories section', () => {
    const BOOKS_WELLNESS_CATEGORY_SEARCH_STATE = {
      ...mockSearchState,
      offerCategories: [SearchGroupNameEnumv2.LIVRES],
      offerNativeCategories: [BooksNativeCategoriesEnum.LOISIRS_ET_BIEN_ETRE],
      offerGenreTypes: [{ key: GenreType.BOOK, value: 'Cuisine', name: 'CUISINE' }],
      gtls: [
        {
          code: '04030000',
          label: 'Arts de la table / Gastronomie',
          level: 2,
        },
      ],
      isFullyDigitalOffersCategory: undefined,
    }

    beforeEach(() => {
      mockSearchState = {
        ...searchState,
        offerCategories: [SearchGroupNameEnumv2.LIVRES],
        offerNativeCategories: [],
      }
    })

    afterEach(() => {
      mockSearchState = searchState
    })

    it('should display the new book native categories section', async () => {
      renderCategories()

      await screen.findByText('Livres papier')

      expect(screen.getByText('Romans et littérature')).toBeOnTheScreen()
    })

    it('should go back to native categories view', async () => {
      renderCategories({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
      })

      const goBackButton = screen.getByTestId('Revenir en arrière')
      await user.press(goBackButton)

      expect(screen.getByText('Livres')).toBeOnTheScreen()
    })

    it('should set search state when search button is pressed', async () => {
      renderCategories()

      await user.press(screen.getByText('Loisirs & Bien-être'))
      await user.press(screen.getByText('Cuisine'))
      await user.press(screen.getByText('Rechercher'))

      const expectedSearchParams: SearchState = BOOKS_WELLNESS_CATEGORY_SEARCH_STATE

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_STATE',
        payload: expectedSearchParams,
      })
    })

    it('should remove offerGenreTypes filter when none is set', async () => {
      mockSearchState = BOOKS_WELLNESS_CATEGORY_SEARCH_STATE

      renderCategories()

      const goBackButton = screen.getByTestId('Revenir en arrière')
      await user.press(goBackButton)

      await user.press(screen.getByText('Tout'))

      const button = screen.getByText('Rechercher')
      await user.press(button)

      const expectedSearchParams: SearchState = {
        ...mockSearchState,
        offerCategories: [SearchGroupNameEnumv2.LIVRES],
        offerNativeCategories: [],
        offerGenreTypes: undefined,
        gtls: undefined,
      }

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_STATE',
        payload: expectedSearchParams,
      })
    })

    it('should reset filters and come back on categories view', async () => {
      renderCategories()

      await user.press(screen.getByText('BD & Comics'))

      await user.press(screen.getByText('Réinitialiser'))

      const defaultCategoryFilterCheckbox = await screen.findByText(ALL_CATEGORIES_LABEL)

      expect(defaultCategoryFilterCheckbox).toBeEnabled()
    })

    it('should keep initial parameters when pressing close button', async () => {
      renderCategories()

      const button = screen.getByText('Réinitialiser')
      await user.press(button)

      const closeButton = screen.getByTestId('Fermer')
      await user.press(closeButton)

      expect(screen.getByText('Livres papier')).toBeOnTheScreen()
    })

    it('should filter on category, native category and genre/type then only on category with all native categories', async () => {
      mockSearchState = BOOKS_WELLNESS_CATEGORY_SEARCH_STATE

      renderCategories()

      const goBackButton = screen.getByTestId('Revenir en arrière')
      await user.press(goBackButton)
      await user.press(goBackButton)

      await user.press(screen.getByText('Jeux & jeux vidéos'))
      await user.press(screen.getByText('Rechercher'))

      const expectedSearchParams: SearchState = {
        ...mockSearchState,
        offerCategories: [SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS],
        offerNativeCategories: [],
        offerGenreTypes: [],
        gtls: [],
      }

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_STATE',
        payload: expectedSearchParams,
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
      await user.press(screen.getByTestId('Revenir en arrière'))
      await user.press(screen.getByTestId('Revenir en arrière'))
      await user.press(screen.getByText('Jeux & jeux vidéos'))

      const searchButton = screen.getByText('Appliquer le filtre')
      await user.press(searchButton)

      const expectedSearchParams: SearchState = {
        ...searchState,
        offerCategories: [SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS],
        offerNativeCategories: [],
        offerGenreTypes: [],
      }

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_STATE',
        payload: expectedSearchParams,
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
      await user.press(closeButton)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should only close the modal when pressing close button when the modal is opening from search results', async () => {
      renderCategories()

      const closeButton = screen.getByTestId('Fermer')
      await user.press(closeButton)

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
      facets={algoliaFacets.facets as FacetData}
      {...props}
    />
  )
}
