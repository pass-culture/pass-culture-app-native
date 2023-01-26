import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { navigate } from '__mocks__/@react-navigation/native'
import { GenreType, NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { SearchAutocompleteItem } from 'features/search/components/SearchAutocompleteItem/SearchAutocompleteItem'
import { initialSearchState } from 'features/search/context/reducer'
import { LocationType } from 'features/search/enums'
import { SearchState, SearchView } from 'features/search/types'
import { AlgoliaSuggestionHit } from 'libs/algolia'
import { env } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import { placeholderData as mockData } from 'libs/subcategories/placeholderData'
import { SuggestedVenue } from 'libs/venue'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { render, fireEvent, screen } from 'tests/utils'

const venue: SuggestedVenue = mockedSuggestedVenues[0]

let mockSearchState: SearchState = {
  ...initialSearchState,
  locationFilter: { locationType: LocationType.VENUE, venue },
  priceRange: [0, 20],
}

const mockDispatch = jest.fn()
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({ searchState: mockSearchState, dispatch: mockDispatch }),
}))

jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

const mockSendEvent = jest.fn()

const searchId = uuidv4()

const mockHit = {
  objectID: '1',
  query: 'cinéma',
  _highlightResult: {
    query: {
      value: '<mark>cinéma</mark>',
      matchLevel: 'full',
      fullyHighlighted: true,
      matchedWords: ['cinéma'],
    },
  },
  __position: 123,
  [env.ALGOLIA_OFFERS_INDEX_NAME]: {
    exact_nb_hits: 2,
    facets: {
      analytics: {
        ['offer.searchGroupNamev2']: [
          {
            attribute: '',
            operator: '',
            value: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
            count: 10,
          },
        ],
        ['offer.nativeCategoryId']: [
          {
            attribute: '',
            operator: '',
            value: NativeCategoryIdEnumv2.SEANCES_DE_CINEMA,
            count: 10,
          },
        ],
      },
    },
  },
} as AlgoliaSuggestionHit

const mockHitSeveralCategoriesWithAssociationToNativeCategory = {
  ...mockHit,
  [env.ALGOLIA_OFFERS_INDEX_NAME]: {
    exact_nb_hits: 2,
    facets: {
      analytics: {
        ['offer.searchGroupNamev2']: [
          {
            attribute: '',
            operator: '',
            value: SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
            count: 10,
          },
        ],
        ['offer.nativeCategoryId']: [
          {
            attribute: '',
            operator: '',
            value: NativeCategoryIdEnumv2.ARTS_VISUELS,
            count: 10,
          },
        ],
      },
    },
  },
}
const mockHitSeveraCategoriesWithoutAssociationToNativeCategory = {
  ...mockHit,
  [env.ALGOLIA_OFFERS_INDEX_NAME]: {
    exact_nb_hits: 2,
    facets: {
      analytics: {
        ['offer.searchGroupNamev2']: [
          {
            attribute: '',
            operator: '',
            value: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
            count: 10,
          },
        ],
        ['offer.nativeCategoryId']: [
          {
            attribute: '',
            operator: '',
            value: NativeCategoryIdEnumv2.ARTS_VISUELS,
            count: 10,
          },
        ],
      },
    },
  },
}

const mockHitWithoutCategoryAndNativeCategory = {
  ...mockHit,
  [env.ALGOLIA_OFFERS_INDEX_NAME]: {
    exact_nb_hits: 2,
    facets: {
      analytics: {
        ['offer.searchGroupNamev2']: [],
        ['offer.nativeCategoryId']: [],
      },
    },
  },
}

const mockHitWithOnlyCategory = {
  ...mockHit,
  [env.ALGOLIA_OFFERS_INDEX_NAME]: {
    exact_nb_hits: 2,
    facets: {
      analytics: {
        ['offer.searchGroupNamev2']: [
          {
            attribute: '',
            operator: '',
            value: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
            count: 10,
          },
        ],
        ['offer.nativeCategoryId']: [],
      },
    },
  },
}

describe('SearchAutocompleteItem component', () => {
  beforeEach(() => {
    mockSearchState = {
      ...initialSearchState,
      locationFilter: { locationType: LocationType.VENUE, venue },
      priceRange: [0, 20],
    }
  })

  it('should render SearchAutocompleteItem', () => {
    expect(
      render(<SearchAutocompleteItem hit={mockHit} sendEvent={mockSendEvent} shouldShowCategory />)
    ).toMatchSnapshot()
  })

  it('should create a suggestion clicked event when pressing a hit', async () => {
    render(<SearchAutocompleteItem hit={mockHit} sendEvent={mockSendEvent} />)
    await fireEvent.press(screen.getByTestId('autocompleteItem'))

    expect(mockSendEvent).toHaveBeenCalledTimes(1)
  })

  describe('when item is not in the first three suggestions', () => {
    it('should execute a search with the query suggestion on hit click', async () => {
      render(<SearchAutocompleteItem hit={mockHit} sendEvent={mockSendEvent} />)
      await fireEvent.press(screen.getByTestId('autocompleteItem'))

      expect(navigate).toBeCalledWith(
        ...getTabNavConfig('Search', {
          ...initialSearchState,
          query: mockHit.query,
          locationFilter: mockSearchState.locationFilter,
          priceRange: mockSearchState.priceRange,
          view: SearchView.Results,
          searchId,
          isAutocomplete: true,
        })
      )
    })

    it('should log a search with the query and selected filters on hit click', async () => {
      render(<SearchAutocompleteItem hit={mockHit} sendEvent={mockSendEvent} />)
      await fireEvent.press(screen.getByTestId('autocompleteItem'))

      expect(analytics.logPerformSearch).toHaveBeenCalledWith({
        ...initialSearchState,
        query: mockHit.query,
        locationFilter: mockSearchState.locationFilter,
        priceRange: mockSearchState.priceRange,
        view: SearchView.Results,
        searchId,
        isAutocomplete: true,
      })
    })

    it('should not display the most popular native category of the query suggestion', async () => {
      render(<SearchAutocompleteItem hit={mockHit} sendEvent={mockSendEvent} />)

      expect(screen.queryByText('Séances de cinéma')).toBeFalsy()
    })

    it('should not execute the search with the category, native category and genre of the previous search on hit click', async () => {
      mockSearchState = {
        ...mockSearchState,
        offerCategories: [SearchGroupNameEnumv2.LIVRES],
        offerNativeCategories: [NativeCategoryIdEnumv2.LIVRES_PAPIER],
        offerGenreTypes: [
          { key: GenreType.BOOK, name: 'Bandes dessinées', value: 'Bandes dessinées' },
        ],
      }
      render(<SearchAutocompleteItem hit={mockHit} sendEvent={mockSendEvent} />)
      await fireEvent.press(screen.getByTestId('autocompleteItem'))

      expect(navigate).toBeCalledWith(
        ...getTabNavConfig('Search', {
          ...initialSearchState,
          query: mockHit.query,
          locationFilter: mockSearchState.locationFilter,
          priceRange: mockSearchState.priceRange,
          view: SearchView.Results,
          searchId,
          isAutocomplete: true,
          offerNativeCategories: undefined,
          offerGenreTypes: undefined,
        })
      )
    })
  })

  describe('when item is in the first three suggestions', () => {
    describe('should execute a search with the query suggestion and', () => {
      it('its most popular native category when it associated to only one category on hit click ', async () => {
        render(
          <SearchAutocompleteItem hit={mockHit} sendEvent={mockSendEvent} shouldShowCategory />
        )
        await fireEvent.press(screen.getByTestId('autocompleteItem'))

        expect(navigate).toBeCalledWith(
          ...getTabNavConfig('Search', {
            ...initialSearchState,
            query: mockHit.query,
            offerCategories: [SearchGroupNameEnumv2.FILMS_SERIES_CINEMA],
            offerNativeCategories: [NativeCategoryIdEnumv2.SEANCES_DE_CINEMA],
            locationFilter: mockSearchState.locationFilter,
            priceRange: mockSearchState.priceRange,
            view: SearchView.Results,
            searchId,
            isAutocomplete: true,
          })
        )
      })

      it('its most popular native category is associated to several categories and is associated to the most popular category', async () => {
        render(
          <SearchAutocompleteItem
            hit={mockHitSeveralCategoriesWithAssociationToNativeCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
          />
        )
        await fireEvent.press(screen.getByTestId('autocompleteItem'))

        expect(navigate).toBeCalledWith(
          ...getTabNavConfig('Search', {
            ...initialSearchState,
            query: mockHitSeveralCategoriesWithAssociationToNativeCategory.query,
            offerCategories: [SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES],
            offerNativeCategories: [NativeCategoryIdEnumv2.ARTS_VISUELS],
            locationFilter: mockSearchState.locationFilter,
            priceRange: mockSearchState.priceRange,
            view: SearchView.Results,
            searchId,
            isAutocomplete: true,
          })
        )
      })

      it('its most popular category when native category associated to several categories and not associated to the most popular category', async () => {
        render(
          <SearchAutocompleteItem
            hit={mockHitSeveraCategoriesWithoutAssociationToNativeCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
          />
        )
        await fireEvent.press(screen.getByTestId('autocompleteItem'))

        expect(navigate).toBeCalledWith(
          ...getTabNavConfig('Search', {
            ...initialSearchState,
            query: mockHitSeveraCategoriesWithoutAssociationToNativeCategory.query,
            offerCategories: [SearchGroupNameEnumv2.FILMS_SERIES_CINEMA],
            locationFilter: mockSearchState.locationFilter,
            priceRange: mockSearchState.priceRange,
            view: SearchView.Results,
            searchId,
            isAutocomplete: true,
          })
        )
      })

      it('the most popular category when the suggestion has not native category', async () => {
        render(
          <SearchAutocompleteItem
            hit={mockHitWithOnlyCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
          />
        )
        await fireEvent.press(screen.getByTestId('autocompleteItem'))

        expect(navigate).toBeCalledWith(
          ...getTabNavConfig('Search', {
            ...initialSearchState,
            query: mockHitWithOnlyCategory.query,
            offerCategories: [SearchGroupNameEnumv2.FILMS_SERIES_CINEMA],
            locationFilter: mockSearchState.locationFilter,
            priceRange: mockSearchState.priceRange,
            view: SearchView.Results,
            searchId,
            isAutocomplete: true,
          })
        )
      })
    })

    describe('should log a search with the others selected filters, the query suggestion and', () => {
      it('its most popular native category when it associated to only one category on hit click', async () => {
        render(
          <SearchAutocompleteItem hit={mockHit} sendEvent={mockSendEvent} shouldShowCategory />
        )
        await fireEvent.press(screen.getByTestId('autocompleteItem'))

        expect(analytics.logPerformSearch).toHaveBeenCalledWith({
          ...initialSearchState,
          query: mockHit.query,
          offerCategories: [SearchGroupNameEnumv2.FILMS_SERIES_CINEMA],
          offerNativeCategories: [NativeCategoryIdEnumv2.SEANCES_DE_CINEMA],
          locationFilter: mockSearchState.locationFilter,
          priceRange: mockSearchState.priceRange,
          view: SearchView.Results,
          searchId,
          isAutocomplete: true,
        })
      })

      it('its most popular native category is associated to several categories and is associated to the most popular category', async () => {
        render(
          <SearchAutocompleteItem
            hit={mockHitSeveralCategoriesWithAssociationToNativeCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
          />
        )
        await fireEvent.press(screen.getByTestId('autocompleteItem'))

        expect(analytics.logPerformSearch).toHaveBeenCalledWith({
          ...initialSearchState,
          query: mockHitSeveralCategoriesWithAssociationToNativeCategory.query,
          offerCategories: [SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES],
          offerNativeCategories: [NativeCategoryIdEnumv2.ARTS_VISUELS],
          locationFilter: mockSearchState.locationFilter,
          priceRange: mockSearchState.priceRange,
          view: SearchView.Results,
          searchId,
          isAutocomplete: true,
        })
      })

      it('its most popular category whe native category associated to several categories and not associated to the most popular category', async () => {
        render(
          <SearchAutocompleteItem
            hit={mockHitSeveraCategoriesWithoutAssociationToNativeCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
          />
        )
        await fireEvent.press(screen.getByTestId('autocompleteItem'))

        expect(analytics.logPerformSearch).toHaveBeenCalledWith({
          ...initialSearchState,
          query: mockHitSeveraCategoriesWithoutAssociationToNativeCategory.query,
          offerCategories: [SearchGroupNameEnumv2.FILMS_SERIES_CINEMA],
          locationFilter: mockSearchState.locationFilter,
          priceRange: mockSearchState.priceRange,
          view: SearchView.Results,
          searchId,
          isAutocomplete: true,
        })
      })

      it('the most popular category when the suggestion has not native category', async () => {
        render(
          <SearchAutocompleteItem
            hit={mockHitWithOnlyCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
          />
        )
        await fireEvent.press(screen.getByTestId('autocompleteItem'))

        expect(analytics.logPerformSearch).toHaveBeenCalledWith({
          ...initialSearchState,
          query: mockHitSeveraCategoriesWithoutAssociationToNativeCategory.query,
          offerCategories: [SearchGroupNameEnumv2.FILMS_SERIES_CINEMA],
          locationFilter: mockSearchState.locationFilter,
          priceRange: mockSearchState.priceRange,
          view: SearchView.Results,
          searchId,
          isAutocomplete: true,
        })
      })
    })

    describe('should display the most popular native category of the query suggestion', () => {
      it('when it associated to only one category', async () => {
        render(
          <SearchAutocompleteItem hit={mockHit} sendEvent={mockSendEvent} shouldShowCategory />
        )

        expect(screen.getByText('Séances de cinéma')).toBeTruthy()
      })

      it('when it associated to the most popular category', async () => {
        render(
          <SearchAutocompleteItem
            hit={mockHitSeveralCategoriesWithAssociationToNativeCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
          />
        )

        expect(screen.getByText('Arts visuels')).toBeTruthy()
      })
    })

    it('should not display the most popular category or native category  of the query suggestion when it does not return by Algolia', async () => {
      render(
        <SearchAutocompleteItem
          hit={mockHitWithoutCategoryAndNativeCategory}
          sendEvent={mockSendEvent}
          shouldShowCategory
        />
      )

      expect(screen.queryByText('dans')).toBeNull()
    })

    it('should not display the most popular native category of the query suggestion when it is not associated to the most popular category', async () => {
      render(
        <SearchAutocompleteItem
          hit={mockHitSeveraCategoriesWithoutAssociationToNativeCategory}
          sendEvent={mockSendEvent}
          shouldShowCategory
        />
      )

      expect(screen.queryByText('Arts visuels')).toBeNull()
    })

    describe('should not display the most popular category of the query suggestion when native category', () => {
      it('associated to only one category', async () => {
        render(
          <SearchAutocompleteItem hit={mockHit} sendEvent={mockSendEvent} shouldShowCategory />
        )

        expect(screen.queryByText('Films, séries, cinéma')).toBeNull()
      })

      it('associated to the most popular category', async () => {
        render(
          <SearchAutocompleteItem
            hit={mockHitSeveralCategoriesWithAssociationToNativeCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
          />
        )

        expect(screen.queryByText('Films, séries, cinéma')).toBeNull()
      })
    })

    describe('should display the most popular category of the query suggestion when', () => {
      it('it is not associated to the most popular category', async () => {
        render(
          <SearchAutocompleteItem
            hit={mockHitSeveraCategoriesWithoutAssociationToNativeCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
          />
        )

        expect(screen.getByText('Films, séries, cinéma')).toBeTruthy()
      })

      it('has not native category associated to the suggestion', async () => {
        render(
          <SearchAutocompleteItem
            hit={mockHitWithOnlyCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
          />
        )

        expect(screen.getByText('Films, séries, cinéma')).toBeTruthy()
      })
    })
  })
})
