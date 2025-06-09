import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { GenreType, NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { AutocompleteOfferItem } from 'features/search/components/AutocompleteOfferItem/AutocompleteOfferItem'
import { initialSearchState } from 'features/search/context/reducer'
import {
  mockHit,
  mockHitIrrelevantResult,
  mockHitRelevantResults,
  mockHitSeveralCategoriesWithAssociationToBooksNativeCategory,
  mockHitSeveralCategoriesWithAssociationToNativeCategory,
  mockHitSeveralCategoriesWithoutAssociationToNativeCategory,
  mockHitUnknownCategory,
  mockHitUnknownNativeCategory,
  mockHitUnknownNativeCategoryAndCategory,
  mockHitWithNativeCategory,
  mockHitWithOnlyCategory,
  mockHitWithUnavailableCategory,
  mockHitWithoutCategoryAndNativeCategory,
  mockHitsWithDifferentCounts,
} from 'features/search/fixtures/autocompleteHits'
import { SearchState } from 'features/search/types'
import { mockedSuggestedVenue } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

const venue = mockedSuggestedVenue

let mockSearchState: SearchState = {
  ...initialSearchState,
  venue,
  priceRange: [0, 20],
}

const mockDispatch = jest.fn()
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
    hideSuggestions: jest.fn(),
  }),
}))

jest.mock('libs/subcategories/useSubcategories')

const mockSendEvent = jest.fn()

const searchId = uuidv4()

jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()
jest.useFakeTimers()

describe('AutocompleteOfferItem component', () => {
  beforeEach(() => {
    mockSearchState = {
      ...initialSearchState,
      venue,
      priceRange: [0, 20],
    }
  })

  it('should not display `CINEMA` searchGroup', async () => {
    render(
      <AutocompleteOfferItem
        hit={mockHit}
        sendEvent={mockSendEvent}
        shouldShowCategory
        addSearchHistory={jest.fn()}
      />,
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await screen.findByText('Films à l’affiche')

    expect(screen.queryByText('Cinéma')).not.toBeOnTheScreen()
  })

  it('should create a suggestion clicked event when pressing a hit', async () => {
    render(
      <AutocompleteOfferItem
        hit={mockHit}
        sendEvent={mockSendEvent}
        addSearchHistory={jest.fn()}
      />,
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await user.press(screen.getByTestId('autocompleteOfferItem_1'))

    expect(mockSendEvent).toHaveBeenCalledTimes(1)
  })

  describe('when a category is specified', () => {
    it('should display a suggested native category if it is relevant', async () => {
      render(
        <AutocompleteOfferItem
          hit={mockHitRelevantResults}
          sendEvent={mockSendEvent}
          shouldShowCategory
          addSearchHistory={jest.fn()}
          offerCategories={[SearchGroupNameEnumv2.LIVRES]}
        />,
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      expect(await screen.findByText('E-books')).toBeOnTheScreen()
    })

    it('should display the search group if it is irrelevant', async () => {
      render(
        <AutocompleteOfferItem
          hit={mockHitIrrelevantResult}
          sendEvent={mockSendEvent}
          shouldShowCategory
          addSearchHistory={jest.fn()}
          offerCategories={[SearchGroupNameEnumv2.LIVRES]}
        />,
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      expect(await screen.findByText('Livres')).toBeOnTheScreen()
    })

    it('should redirect to the specified category page', async () => {
      render(
        <AutocompleteOfferItem
          hit={mockHitRelevantResults}
          sendEvent={mockSendEvent}
          shouldShowCategory
          addSearchHistory={jest.fn()}
          offerCategories={[SearchGroupNameEnumv2.LIVRES]}
        />,
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      await user.press(screen.getByTestId('autocompleteOfferItem_1'))

      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        type: 'SET_STATE',
        payload: expect.objectContaining({
          offerCategories: [SearchGroupNameEnumv2.LIVRES],
        }),
      })

      expect(screen.getByText('E-books')).toBeOnTheScreen()
    })
  })

  describe('when item is not in the first three suggestions', () => {
    it('should execute a search with the query suggestion on hit click', async () => {
      render(
        <AutocompleteOfferItem
          hit={mockHit}
          sendEvent={mockSendEvent}
          addSearchHistory={jest.fn()}
        />,
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      await screen.findByText('cinéma')

      expect(screen.queryByText('Films à l’affiche')).not.toBeOnTheScreen()
    })

    it('should not display the most popular native category of the query suggestion', async () => {
      render(
        <AutocompleteOfferItem
          hit={mockHit}
          sendEvent={mockSendEvent}
          addSearchHistory={jest.fn()}
        />,
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      await screen.findByText('cinéma')

      expect(screen.queryByText('Films à l’affiche')).not.toBeOnTheScreen()
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
      render(
        <AutocompleteOfferItem
          hit={mockHit}
          sendEvent={mockSendEvent}
          addSearchHistory={jest.fn()}
        />,
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )
      await user.press(screen.getByTestId('autocompleteOfferItem_1'))

      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        type: 'SET_STATE',
        payload: {
          ...initialSearchState,
          query: mockHit.query,
          locationFilter: mockSearchState.locationFilter,
          venue: mockSearchState.venue,
          priceRange: mockSearchState.priceRange,
          searchId,
          isAutocomplete: true,
          offerNativeCategories: [],
          isFromHistory: undefined,
        },
      })
    })
  })

  describe('most popular category', () => {
    it('should be sorted by the higher count', async () => {
      render(
        <AutocompleteOfferItem
          hit={mockHitsWithDifferentCounts}
          sendEvent={mockSendEvent}
          shouldShowCategory
          addSearchHistory={jest.fn()}
          offerCategories={[SearchGroupNameEnumv2.LIVRES]}
        />,
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      await screen.findByText('cinéma')

      await expect(
        screen.getByText('Abonnements aux médiathèques et bibliothèques')
      ).toBeOnTheScreen()
    })
  })

  describe('when item is in the first three suggestions', () => {
    describe('should execute a search with the query suggestion and', () => {
      it('its most popular native category when it associated to only one category on hit click', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHit}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />,
          {
            wrapper: ({ children }) => reactQueryProviderHOC(children),
          }
        )
        await user.press(screen.getByTestId('autocompleteOfferItem_1'))

        expect(mockDispatch).toHaveBeenNthCalledWith(1, {
          type: 'SET_STATE',
          payload: {
            ...initialSearchState,
            query: mockHit.query,
            offerCategories: [SearchGroupNameEnumv2.CINEMA],
            offerNativeCategories: [NativeCategoryIdEnumv2.SEANCES_DE_CINEMA],
            locationFilter: mockSearchState.locationFilter,
            venue: mockSearchState.venue,
            priceRange: mockSearchState.priceRange,
            searchId,
            isAutocomplete: true,
          },
        })
      })

      it('its most popular native category is associated to several categories and is associated to the most popular category', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHitSeveralCategoriesWithAssociationToNativeCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />,
          {
            wrapper: ({ children }) => reactQueryProviderHOC(children),
          }
        )
        await user.press(screen.getByTestId('autocompleteOfferItem_1'))

        expect(mockDispatch).toHaveBeenNthCalledWith(1, {
          type: 'SET_STATE',
          payload: {
            ...initialSearchState,
            query: mockHitSeveralCategoriesWithAssociationToNativeCategory.query,
            offerCategories: [SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS],
            offerNativeCategories: [NativeCategoryIdEnumv2.ARTS_VISUELS],
            locationFilter: mockSearchState.locationFilter,
            venue: mockSearchState.venue,
            priceRange: mockSearchState.priceRange,
            searchId,
            isAutocomplete: true,
          },
        })
      })

      it('its most popular category when native category associated to several categories and not associated to the most popular category', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHitSeveralCategoriesWithoutAssociationToNativeCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />,
          {
            wrapper: ({ children }) => reactQueryProviderHOC(children),
          }
        )
        await user.press(screen.getByTestId('autocompleteOfferItem_1'))

        expect(mockDispatch).toHaveBeenNthCalledWith(1, {
          type: 'SET_STATE',
          payload: {
            ...initialSearchState,
            query: mockHitSeveralCategoriesWithoutAssociationToNativeCategory.query,
            offerCategories: [SearchGroupNameEnumv2.CONCERTS_FESTIVALS],
            locationFilter: mockSearchState.locationFilter,
            venue: mockSearchState.venue,
            priceRange: mockSearchState.priceRange,
            searchId,
            isAutocomplete: true,
          },
        })
      })

      it('the most popular category when the suggestion has not native category', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHitWithOnlyCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />,
          {
            wrapper: ({ children }) => reactQueryProviderHOC(children),
          }
        )
        await user.press(screen.getByTestId('autocompleteOfferItem_1'))

        expect(mockDispatch).toHaveBeenNthCalledWith(1, {
          type: 'SET_STATE',
          payload: {
            ...initialSearchState,
            query: mockHitWithOnlyCategory.query,
            offerCategories: [SearchGroupNameEnumv2.CONCERTS_FESTIVALS],
            locationFilter: mockSearchState.locationFilter,
            venue: mockSearchState.venue,
            priceRange: mockSearchState.priceRange,
            searchId,
            isAutocomplete: true,
          },
        })
      })

      it('without the most popular category and native category when there are unknown in the app', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHitUnknownNativeCategoryAndCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />,
          {
            wrapper: ({ children }) => reactQueryProviderHOC(children),
          }
        )

        await user.press(screen.getByTestId('autocompleteOfferItem_1'))

        expect(mockDispatch).toHaveBeenNthCalledWith(1, {
          type: 'SET_STATE',
          payload: {
            ...initialSearchState,
            query: mockHitWithOnlyCategory.query,
            offerCategories: [],
            locationFilter: mockSearchState.locationFilter,
            venue: mockSearchState.venue,
            priceRange: mockSearchState.priceRange,
            searchId,
            isAutocomplete: true,
          },
        })
      })

      it('without the most popular category when it is unknown in the app', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHitUnknownCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />,
          {
            wrapper: ({ children }) => reactQueryProviderHOC(children),
          }
        )
        await user.press(screen.getByTestId('autocompleteOfferItem_1'))

        expect(mockDispatch).toHaveBeenNthCalledWith(1, {
          type: 'SET_STATE',
          payload: {
            ...initialSearchState,
            query: mockHitWithOnlyCategory.query,
            offerCategories: [],
            locationFilter: mockSearchState.locationFilter,
            venue: mockSearchState.venue,
            priceRange: mockSearchState.priceRange,
            searchId,
            isAutocomplete: true,
          },
        })
      })

      it('without the most popular native category but the most popular category when native category is unknown in the app', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHitUnknownNativeCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />,
          {
            wrapper: ({ children }) => reactQueryProviderHOC(children),
          }
        )
        await user.press(screen.getByTestId('autocompleteOfferItem_1'))

        expect(mockDispatch).toHaveBeenNthCalledWith(1, {
          type: 'SET_STATE',
          payload: {
            ...initialSearchState,
            query: mockHitWithOnlyCategory.query,
            offerCategories: [SearchGroupNameEnumv2.MUSIQUE],
            offerNativeCategories: [],
            locationFilter: mockSearchState.locationFilter,
            priceRange: mockSearchState.priceRange,
            searchId,
            isAutocomplete: true,
            venue: mockSearchState.venue,
          },
        })
      })
    })

    describe('should display the most popular native category of the query suggestion', () => {
      it('when it associated to only one category', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHit}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />,
          {
            wrapper: ({ children }) => reactQueryProviderHOC(children),
          }
        )

        expect(await screen.findByText('Films à l’affiche')).toBeOnTheScreen()
      })

      it('when it associated to the most popular category', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHitSeveralCategoriesWithAssociationToNativeCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />,
          {
            wrapper: ({ children }) => reactQueryProviderHOC(children),
          }
        )

        expect(await screen.findByText('Arts visuels')).toBeOnTheScreen()
      })
    })

    describe('should not display the most popular category or native category of the query suggestion', () => {
      it('when it does not return by Algolia', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHitWithoutCategoryAndNativeCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />,
          {
            wrapper: ({ children }) => reactQueryProviderHOC(children),
          }
        )

        await screen.findByText('cinéma')

        expect(screen.queryByText('dans')).not.toBeOnTheScreen()
      })

      it('when there are unknown in the app', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHitUnknownNativeCategoryAndCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />,
          {
            wrapper: ({ children }) => reactQueryProviderHOC(children),
          }
        )

        await screen.findByText('cinéma')

        expect(screen.queryByText('dans')).not.toBeOnTheScreen()
      })
    })

    describe('should not display the most popular native category of the query suggestion', () => {
      it('when it is not associated to the most popular category', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHitSeveralCategoriesWithoutAssociationToNativeCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />,
          {
            wrapper: ({ children }) => reactQueryProviderHOC(children),
          }
        )

        await screen.findByText('cinéma')

        expect(screen.queryByText('Arts visuels')).not.toBeOnTheScreen()
      })

      it('when it is unknown in the app', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHitUnknownNativeCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />,
          {
            wrapper: ({ children }) => reactQueryProviderHOC(children),
          }
        )

        await screen.findByText('cinéma')

        expect(screen.queryByText('dans CD_VINYLES')).not.toBeOnTheScreen()
      })
    })

    describe('should not display the most popular category of the query suggestion', () => {
      it('when native category associated to only one category', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHitSeveralCategoriesWithAssociationToNativeCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />,
          {
            wrapper: ({ children }) => reactQueryProviderHOC(children),
          }
        )

        await screen.findByText('cinéma')

        expect(screen.queryByText('Musées & visites culturelles')).not.toBeOnTheScreen()
      })

      it('when native category associated to the most popular category', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHitSeveralCategoriesWithAssociationToNativeCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />,
          {
            wrapper: ({ children }) => reactQueryProviderHOC(children),
          }
        )

        await screen.findByText('cinéma')

        expect(screen.queryByText('Musées & visites culturelles')).not.toBeOnTheScreen()
      })

      it('when category is unknown in the app', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHitUnknownCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />,
          {
            wrapper: ({ children }) => reactQueryProviderHOC(children),
          }
        )

        await screen.findByText('cinéma')

        expect(screen.queryByText('dans')).not.toBeOnTheScreen()
      })
    })

    describe('should display the most popular category of the query suggestion when', () => {
      it('is not associated to the most popular category', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHitSeveralCategoriesWithoutAssociationToNativeCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />,
          {
            wrapper: ({ children }) => reactQueryProviderHOC(children),
          }
        )

        expect(await screen.findByText('Concerts & festivals')).toBeOnTheScreen()
      })

      it('has not native category associated to the suggestion', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHitWithOnlyCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />,
          {
            wrapper: ({ children }) => reactQueryProviderHOC(children),
          }
        )

        expect(await screen.findByText('Concerts & festivals')).toBeOnTheScreen()
      })

      it('native category is unknown in the app', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHitUnknownNativeCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />,
          {
            wrapper: ({ children }) => reactQueryProviderHOC(children),
          }
        )

        expect(await screen.findByText('Musique')).toBeOnTheScreen()
      })

      it('native category is Livres Papier', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHitSeveralCategoriesWithAssociationToBooksNativeCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />,
          {
            wrapper: ({ children }) => reactQueryProviderHOC(children),
          }
        )

        expect(await screen.findByText('Livres')).toBeOnTheScreen()
      })
    })

    it('should not display category suggestion when not native category suggested and searchGroup is unavailable', async () => {
      render(
        <AutocompleteOfferItem
          hit={mockHitWithUnavailableCategory}
          sendEvent={mockSendEvent}
          shouldShowCategory
          addSearchHistory={jest.fn()}
        />,
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      await screen.findByText('cinéma')

      expect(screen.queryByText('dans')).not.toBeOnTheScreen()
    })

    it('should display native category suggestion on search landing', async () => {
      render(
        <AutocompleteOfferItem
          hit={mockHitWithNativeCategory}
          sendEvent={mockSendEvent}
          shouldShowCategory
          addSearchHistory={jest.fn()}
          offerCategories={[]}
        />,
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      expect(await screen.findByText('Films à l’affiche')).toBeOnTheScreen()
    })
  })
})
